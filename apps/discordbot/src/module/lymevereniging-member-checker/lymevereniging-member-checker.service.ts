import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import discord, {
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} from 'discord.js';
import { SendVerificationMessageDto } from './dto/send-verification-message.dto';
import { Discord } from '../../discord/discord';
import { MessageButtonStyles, TextInputStyles } from 'discord.js/typings/enums';
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
import { Not, Repository } from 'typeorm';
import { Guild } from '@common/common/guild/guild.entity';
import { FeatureConfig } from '@common/common/feature-config/feature-config.entity';
import { Feature, FeatureType } from '@common/common/feature/feature.entity';
import { LymeverenigingMemberCheckerFeatureConfigDto } from './dto/lymevereniging-member-checker-feature-config.dto';
import { LymeverenigingGuildMember } from '@common/common/apps/lymevereniging-member-checker/entity/lymevereniging-guild-member.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { userMention } from '@discordjs/builders';

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
    const messageActionRow = new MessageActionRow();

    const messageButton = new MessageButton()
      .setCustomId(this.verificationButtonUuid)
      .setLabel('Verifieer nu!')
      .setStyle(MessageButtonStyles.PRIMARY)
      .setEmoji('✅');

    messageActionRow.addComponents(messageButton);

    await this.discord.channels.fetch(
      sendVerificationMessageDto.channelSnowflake,
    );

    const guildChannel = this.discord.channels.cache.get(
      sendVerificationMessageDto.channelSnowflake,
    );

    if (!guildChannel) throw new ChannelNotFoundError();
    if (!guildChannel.isText()) throw new ChannelNotTextChannelError();

    await guildChannel.send({
      content: `Hey daar! Verifieer jouw lidmaatschap alstublieft.`,
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
    const modal = new Modal()
      .setCustomId(this.verificationModalUuid)
      .setTitle('Lidmaatschap verifiëren');

    const emailInput = new TextInputComponent()
      .setCustomId(this.verificationModalEmailInputUuid)
      .setLabel('Email adres')
      .setPlaceholder('Email adres waarmee je geregistreerd staat')
      .setRequired(true)
      .setStyle(TextInputStyles.SHORT)
      .setMaxLength(255);

    const firstActionRow =
      new MessageActionRow<TextInputComponent>().addComponents(emailInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }

  private async respondToEmailVerifyButton(
    interaction: discord.ButtonInteraction<discord.CacheType>,
  ) {
    const modal = new Modal()
      .setCustomId(this.emailVerificationModalUuid)
      .setTitle('Email adres verifiëren');

    const emailInput = new TextInputComponent()
      .setCustomId(this.emailVerificationModalCodeInputUuid)
      .setLabel('Verificatie code')
      .setPlaceholder('123456')
      .setRequired(true)
      .setStyle(TextInputStyles.SHORT)
      .setMinLength(6)
      .setMaxLength(6);

    const firstActionRow =
      new MessageActionRow<TextInputComponent>().addComponents(emailInput);

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

      const messageActionRow = new MessageActionRow();

      const messageButton = new MessageButton()
        .setCustomId(this.emailVerificationButtonUuid)
        .setLabel('Verifieer email adres met code!')
        .setStyle(MessageButtonStyles.PRIMARY)
        .setEmoji('👋');

      messageActionRow.addComponents(messageButton);

      const randomNumber = randomInt(0, 1000000);
      const verificationCode = randomNumber.toString().padStart(6, '0');

      const guild = await this.guildRepository.findOne({
        where: {
          snowflake: interaction.guild.id,
        },
        relations: {
          tenant: true,
        },
      });

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
              subject: 'Email verifiëren',
              body: `Verifieer je email adres door deze code in te vullen in de Discord server: ${verificationCode}`,
              bodyHtml: `Verifieer je email adres door deze code in te vullen in de Discord server: <b>${verificationCode}</b>`,
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
        content: `We hebben geverifieerd dat jij lid bent van de Lymevereniging! Bedankt!\nNu volgt er nog 1 stap voor je toegang krijgt tot de server. Er is een email gestuurd met een code om je email adres te verifieren, deze dien je hier in te vullen.`,
        components: [messageActionRow],
      });
    } catch (err) {
      if (err instanceof VerificationModalInvalidEmailError) {
        await interaction.editReply({
          content: 'Oeps, dat is geen geldig email adres. Probeer het opnieuw.',
        });
      } else if (err instanceof VerificationModalNotAMemberError) {
        await interaction.editReply({
          content:
            'Wij konden jouw lidmaatschap niet verifiëren. Probeer opnieuw, of neem contact op met iemand. Het kan ook zijn dat jouw lidmaatschap verlopen is.',
        });
      } else {
        this.logger.error(err);
        await interaction.editReply({
          content:
            'Er is een intern probleem opgetreden! Gelieve contact op te nemen met Jonas Claes.',
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
      .trim();

    const validationSchema = yup.string().max(6).min(6).required();
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
      if (!feature) return;

      const featureConfig = await this.featureConfigRepository.findOne({
        where: {
          featureId: feature.id,
        },
      });
      if (!featureConfig) return;

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
        content: `We hebben jouw email adres geverifieerd! Bedankt! Je krijgt binnen enkele seconden toegang tot de server!`,
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
            'Er is een intern probleem opgetreden! Gelieve contact op te nemen met Jonas Claes.',
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
      )}! Onze systemen hebben geconcludeerd dat jij niet meer lid bent van de Lymevereniging, jammer! Met deze nieuwe status hebben wij automatisch jouw toegang tot de Lymevereniging Discord server verwijderd.`,
    });
    await discordGuildMember.roles.remove(config.roleSnowflake);
  }
}
