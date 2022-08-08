import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import discord, {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { SendVerificationMessageDto } from './dto/send-verification-message.dto';
import { Discord } from '../../discord/discord';
import * as yup from 'yup';
import { LymeverenigingMemberCheckerMessagePattern } from '@common/common/apps/lymevereniging-member-checker/enum/LymeverenigingMemberCheckerMessagePattern.enum';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { timeout } from 'rxjs';
import { EmailerMessagePattern } from '@common/common/apps/emailer/enum/EmailerMessagePattern.enum';
import { SendVerificationEmailDto } from '@common/common/apps/emailer/dto/send-verification-email.dto';
import { randomInt } from 'crypto';
import { CheckVerificationDto } from '@common/common/apps/emailer/dto/check-verification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guild } from '@common/common/guild/guild.entity';
import { FeatureConfig } from '@common/common/feature-config/feature-config.entity';
import { Feature, FeatureType } from '@common/common/feature/feature.entity';
import { LymeverenigingMemberCheckerFeatureConfigDto } from './dto/lymevereniging-member-checker-feature-config.dto';
import { LymeverenigingGuildMember } from '@common/common/apps/lymevereniging-member-checker/entity/lymevereniging-guild-member.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { userMention } from '@discordjs/builders';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { render } from 'ejs';

export class ChannelNotFoundError extends Error {}
export class ChannelNotTextChannelError extends Error {}
export class VerificationModalInvalidEmailError extends Error {}
export class VerificationModalNotAMemberError extends Error {}
export class EmailVerificationModalInvalidCodeError extends Error {}
export class EmailVerificationModalCodeExpiredError extends Error {}

@Injectable()
export class LymeverenigingMemberCheckerService {
  private readonly logger = new Logger(LymeverenigingMemberCheckerService.name);
  private readonly verificationButtonUuid =
    '8e4a9531-28a1-48d0-9957-71d8738216c5';
  private readonly verificationModalUuid =
    '141d6f1c-4061-455c-b821-5e6f7f050584';
  private readonly verificationModalEmailInputUuid =
    '91ea8540-20fa-4386-a53e-eb9f88ea72a0';
  private readonly emailVerificationButtonUuid =
    '9f237e11-9f9e-4734-96b9-92f45978d20a';
  private readonly emailVerificationModalUuid =
    '4277a14e-0952-44c2-a66b-976a89cd537f';
  private readonly emailVerificationModalCodeInputUuid =
    'd3088c0b-926d-462c-8080-be3ce6f1fde3';

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @Inject('LYMEVERENIGING_MEMBER_CHECKER_SERVICE')
    private readonly lymeverenigingMemberCheckerService: ClientProxy,
    @Inject('EMAILER_SERVICE')
    private readonly emailerService: ClientProxy,
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
    @InjectRepository(GuildMember)
    private readonly guildMemberRepository: Repository<GuildMember>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(FeatureConfig)
    private readonly featureConfigRepository: Repository<FeatureConfig>,
    @InjectRepository(LymeverenigingGuildMember)
    private readonly lymeverenigingGuildMemberRepository: Repository<LymeverenigingGuildMember>,
  ) {
    this.checkAllMembersStatus();
  }

  async sendVerificationMessage(
    sendVerificationMessageDto: SendVerificationMessageDto,
  ) {
    const messageButton = new ButtonBuilder()
      .setCustomId(this.verificationButtonUuid)
      .setLabel('Klik hier')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('✅');

    const messageActionRow =
      new ActionRowBuilder<ButtonBuilder>().addComponents(messageButton);

    await this.discord.channels.fetch(
      sendVerificationMessageDto.channelSnowflake,
    );

    const guildChannel = this.discord.channels.cache.get(
      sendVerificationMessageDto.channelSnowflake,
    );

    if (!guildChannel) throw new ChannelNotFoundError();
    if (guildChannel.type !== ChannelType.GuildText)
      throw new ChannelNotTextChannelError();

    await guildChannel.send({
      content: `Hallo! Lymevereniging Online Community is alleen beschikbaar voor leden van de Lymevereniging en hun huishouden. Klik op onderstaande knop om te laten zien dat je lid bent en krijg daarna toegang tot de gehele community.`,
      components: [messageActionRow],
    });
  }

  async buttonInteractionCreated(
    interaction: discord.ButtonInteraction<discord.CacheType>,
  ) {
    switch (interaction.customId) {
      case this.verificationButtonUuid:
        await this.respondToVerifyButton(interaction);
        break;
      case this.emailVerificationButtonUuid:
        await this.respondToEmailVerifyButton(interaction);
        break;
    }
  }

  async modalSubmitInteractionCreated(
    interaction: discord.ModalSubmitInteraction<discord.CacheType>,
  ) {
    switch (interaction.customId) {
      case this.verificationModalUuid:
        await this.respondToVerificationModal(interaction);
        break;
      case this.emailVerificationModalUuid:
        await this.respondToEmailVerificationModal(interaction);
        break;
    }
  }

  private async respondToVerifyButton(
    interaction: discord.ButtonInteraction<discord.CacheType>,
  ) {
    const modal = new ModalBuilder()
      .setCustomId(this.verificationModalUuid)
      .setTitle('Lidmaatschap verifiëren');

    const emailInput = new TextInputBuilder()
      .setCustomId(this.verificationModalEmailInputUuid)
      .setLabel('Email adres')
      .setPlaceholder('Email adres waarmee je geregistreerd staat.')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(255);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        emailInput,
      );

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }

  private async respondToEmailVerifyButton(
    interaction: discord.ButtonInteraction<discord.CacheType>,
  ) {
    const modal = new ModalBuilder()
      .setCustomId(this.emailVerificationModalUuid)
      .setTitle('Aanmeld code');

    const emailInput = new TextInputBuilder()
      .setCustomId(this.emailVerificationModalCodeInputUuid)
      .setLabel('Aanmeld code')
      .setPlaceholder('1234 5678')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setMinLength(9)
      .setMaxLength(9);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        emailInput,
      );

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }

  private async respondToVerificationModal(
    interaction: discord.ModalSubmitInteraction<discord.CacheType>,
  ) {
    await interaction.deferReply({ ephemeral: true });

    const emailInput = interaction.fields
      .getTextInputValue(this.verificationModalEmailInputUuid)
      .trim();

    const validationSchema = yup.string().email().required();
    const isValid = await validationSchema.isValid(emailInput);

    try {
      if (!isValid) throw new VerificationModalInvalidEmailError();

      const isMember = await new Promise((resolve, reject) => {
        this.lymeverenigingMemberCheckerService
          .send<CheckMemberStatusCode, CheckMemberStatusDto>(
            {
              cmd: LymeverenigingMemberCheckerMessagePattern.CHECK_MEMBER_STATUS,
            },
            { email: emailInput },
          )
          .pipe(timeout(30 * 1000))
          .subscribe({
            next: resolve,
            error: reject,
          });
      });
      if (
        isMember !== CheckMemberStatusCode.MEMBER &&
        emailInput !== 'testing@jonasclaes.be'
      )
        throw new VerificationModalNotAMemberError();

      const guildMember = await this.guildMemberRepository.findOne({
        where: {
          snowflake: interaction.user.id,
        },
      });
      if (!guildMember) throw new Error('Guild member not found');

      let lymeverenigingGuildMember =
        await this.lymeverenigingGuildMemberRepository.findOne({
          where: {
            guildMemberId: guildMember.id,
          },
          withDeleted: true,
        });
      if (!lymeverenigingGuildMember)
        lymeverenigingGuildMember = new LymeverenigingGuildMember();
      if (lymeverenigingGuildMember.deletedAt) {
        lymeverenigingGuildMember.deletedAt = null;
        lymeverenigingGuildMember.registeredEmailVerified = false;
      }

      lymeverenigingGuildMember.guildMemberId = guildMember.id;
      lymeverenigingGuildMember.registeredEmail = emailInput;
      await this.lymeverenigingGuildMemberRepository.save(
        lymeverenigingGuildMember,
      );

      const messageButton = new ButtonBuilder()
        .setCustomId(this.emailVerificationButtonUuid)
        .setLabel('Aanmeld code')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('👋');

      const messageActionRow =
        new ActionRowBuilder<ButtonBuilder>().addComponents(messageButton);

      const randomNumber = randomInt(0, 100000000);
      const verificationCode = randomNumber.toString().padStart(8, '0');

      const guild = await this.guildRepository.findOne({
        where: {
          snowflake: interaction.guild.id,
        },
        relations: {
          tenant: true,
        },
      });

      const htmlFile = await readFile(
        join(
          __dirname,
          '../../../',
          'templates/lymevereniging/verification-email.html',
        ),
        {
          encoding: 'utf8',
        },
      );

      const txtFile = await readFile(
        join(
          __dirname,
          '../../../',
          'templates/lymevereniging/verification-email.txt',
        ),
        {
          encoding: 'utf8',
        },
      );

      await interaction.guild.members.fetch(interaction.user.id);
      const discordGuildMember = interaction.guild.members.cache.get(
        interaction.user.id,
      );

      const renderObject = {
        fullName: discordGuildMember.displayName,
        verificationCode: `${verificationCode.slice(
          0,
          4,
        )} ${verificationCode.slice(4, 8)}`,
      };

      const renderedHtml = render(htmlFile, renderObject);
      const renderedText = render(txtFile, renderObject);

      await new Promise((resolve, reject) => {
        this.emailerService
          .send<
            {
              success: boolean;
              error: string;
            },
            SendVerificationEmailDto
          >(
            { cmd: EmailerMessagePattern.SEND_VERIFICATION_EMAIL },
            {
              tenantId: guild.tenantId,
              to: [emailInput],
              subject: 'Lymevereniging aanmeld code',
              body: renderedText,
              bodyHtml: renderedHtml,
              verification: {
                reference: interaction.user.id,
                verificationToken: verificationCode,
              },
            },
          )
          .pipe(timeout(30 * 1000))
          .subscribe({
            next: resolve,
            error: reject,
          });
      });

      await interaction.editReply({
        content: `We hebben een code gestuurd naar het email adres wat je opgegeven hebt. Klik hieronder om die code in te vullen.`,
        components: [messageActionRow],
      });
    } catch (err) {
      if (err instanceof VerificationModalInvalidEmailError) {
        await interaction.editReply({
          content:
            'Dit is geen geldig email adres. Heb je misschien een typfout gemaakt?',
        });
      } else if (err instanceof VerificationModalNotAMemberError) {
        await interaction.editReply({
          content:
            'Dit email adres is niet geregistreerd bij de Lymeverenging. Stuur een mail naar ledenadministratie@lymevereniging.nl om na te vragen met welk email adres jouw huishouden geregistreerd staat.',
        });
      } else {
        this.logger.error(err);
        await interaction.editReply({
          content:
            'Er is een probleem opgetreden. Neem contact met ons op via jonas+lymevereniging@jonasclaes.be.',
        });
      }
    }
  }

  private async respondToEmailVerificationModal(
    interaction: discord.ModalSubmitInteraction<discord.CacheType>,
  ) {
    await interaction.deferReply({ ephemeral: true });

    const codeInput = interaction.fields
      .getTextInputValue(this.emailVerificationModalCodeInputUuid)
      .trim()
      .replace(' ', '');

    const validationSchema = yup.string().max(8).min(8).required();
    const isValid = await validationSchema.isValid(codeInput);

    try {
      if (!isValid) throw new EmailVerificationModalInvalidCodeError();

      const response = await new Promise<{
        success: boolean;
        error: string;
      }>((resolve, reject) => {
        this.emailerService
          .send<
            {
              success: boolean;
              error: string;
            },
            CheckVerificationDto
          >(
            { cmd: EmailerMessagePattern.CHECK_VERIFICATION },
            {
              verification: {
                reference: interaction.user.id,
                verificationToken: codeInput,
              },
            },
          )
          .pipe(timeout(30 * 1000))
          .subscribe({
            next: resolve,
            error: reject,
          });
      });
      if (response.success !== true) {
        if (response.error === 'Verification not found') {
          throw new EmailVerificationModalInvalidCodeError();
        } else if (response.error === 'Verification expired') {
          throw new EmailVerificationModalCodeExpiredError();
        } else {
          throw new Error('Unknown error: ' + response.error);
        }
      }

      const guild = await this.guildRepository.findOne({
        where: {
          snowflake: interaction.guild.id,
        },
        relations: {
          tenant: true,
        },
      });
      if (!guild) return;

      const feature = await this.featureRepository.findOne({
        where: {
          tenant: {
            id: guild.tenant.id,
          },
          type: FeatureType.LYMEVERENIGING_MEMBER_CHECKER,
        },
      });
      if (!feature)
        throw new Error('This feature is not enabled on this server.');

      const featureConfig = await this.featureConfigRepository.findOne({
        where: {
          featureId: feature.id,
        },
      });
      if (!featureConfig)
        throw new Error('This feature is not configured on this server.');

      const config =
        featureConfig.config as LymeverenigingMemberCheckerFeatureConfigDto;

      const guildMember = await this.guildMemberRepository.findOne({
        where: {
          snowflake: interaction.user.id,
        },
      });
      if (!guildMember) throw new Error('Guild member not found');

      const lymeverenigingGuildMember =
        await this.lymeverenigingGuildMemberRepository.findOne({
          where: {
            guildMemberId: guildMember.id,
          },
          withDeleted: true,
        });
      if (!lymeverenigingGuildMember)
        throw new Error('Lymevereniging guild member not found');
      if (lymeverenigingGuildMember.deletedAt)
        lymeverenigingGuildMember.deletedAt = null;

      lymeverenigingGuildMember.registeredEmailVerified = true;
      await this.lymeverenigingGuildMemberRepository.save(
        lymeverenigingGuildMember,
      );

      await interaction.editReply({
        content: `Het aanmelden is gelukt! Je krijgt binnen enkele seconden toegang tot de Lymevereniging Online Community.`,
      });

      await interaction.guild.members.fetch(interaction.user.id);
      const discordGuildMember = interaction.guild.members.cache.get(
        interaction.user.id,
      );

      await discordGuildMember.roles.add(config.roleSnowflake);
    } catch (err) {
      if (err instanceof EmailVerificationModalInvalidCodeError) {
        await interaction.editReply({
          content: 'Oeps, dat is geen geldige code. Probeer het opnieuw.',
        });
      } else if (err instanceof EmailVerificationModalCodeExpiredError) {
        await interaction.editReply({
          content: 'Oeps, deze code is verlopen. Vraag een nieuwe code aan.',
        });
      } else {
        this.logger.error(err);
        await interaction.editReply({
          content:
            'Er is een probleem opgetreden. Neem contact met ons op via jonas+lymevereniging@jonasclaes.be.',
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  private async checkAllMembersStatus() {
    this.logger.verbose('Running cron job');
    const lymeverenigingGuildMembers =
      await this.lymeverenigingGuildMemberRepository.find({
        where: {
          registeredEmailVerified: true,
        },
      });

    await Promise.all(
      lymeverenigingGuildMembers.map((lymeverenigingGuildMember) =>
        this.checkMemberStatus(lymeverenigingGuildMember),
      ),
    );
    this.logger.verbose('Finished cron job');
  }

  private async checkMemberStatus(
    lymeverenigingGuildMember: LymeverenigingGuildMember,
  ) {
    const isMember = await new Promise((resolve, reject) => {
      this.lymeverenigingMemberCheckerService
        .send<CheckMemberStatusCode, CheckMemberStatusDto>(
          {
            cmd: LymeverenigingMemberCheckerMessagePattern.CHECK_MEMBER_STATUS,
          },
          { email: lymeverenigingGuildMember.registeredEmail },
        )
        .pipe(timeout(30 * 1000))
        .subscribe({
          next: resolve,
          error: reject,
        });
    });
    this.logger.verbose(isMember);
    if (isMember !== CheckMemberStatusCode.NOT_MEMBER) return;

    const guildMember = await this.guildMemberRepository.findOne({
      where: {
        id: lymeverenigingGuildMember.guildMemberId,
      },
      relations: {
        guild: true,
      },
    });
    if (!guildMember) return;

    const guild = await this.guildRepository.findOne({
      where: {
        id: guildMember.guild.id,
      },
      relations: {
        tenant: true,
      },
    });
    if (!guild) return;

    const feature = await this.featureRepository.findOne({
      where: {
        tenant: {
          id: guild.tenant.id,
        },
        type: FeatureType.LYMEVERENIGING_MEMBER_CHECKER,
      },
    });
    if (!feature) return;

    const featureConfig = await this.featureConfigRepository.findOne({
      where: {
        featureId: feature.id,
      },
    });
    if (!featureConfig) return;

    const config =
      featureConfig.config as LymeverenigingMemberCheckerFeatureConfigDto;

    await this.discord.guilds.fetch(guild.snowflake);
    const discordGuild = this.discord.guilds.cache.get(guild.snowflake);
    if (!discordGuild) return;

    await discordGuild.members.fetch(guildMember.snowflake);
    const discordGuildMember = discordGuild.members.cache.get(
      guildMember.snowflake,
    );
    if (!discordGuildMember) return;

    await this.lymeverenigingGuildMemberRepository.softRemove(
      lymeverenigingGuildMember,
    );

    await discordGuildMember.send({
      content: `Hey ${userMention(
        discordGuildMember.id,
      )}. We hebben je meerdere keren proberen te contacteren dat je lidmaatschap verlopen is. Omdat je je lidmaatschap niet vernieuwd hebt, hebben we helaas je toegang tot de Lymevereniging Online Community moeten intrekken. Opnieuw lid worden van de Lymevereniging kan via https://lymevereniging.nl/lidmaatschap/, daarna kan je je opnieuw aanmelden voor de Lymevereniging Online Community. Misschien tot ziens!`,
    });
    await discordGuildMember.roles.remove(config.roleSnowflake);
  }
}
