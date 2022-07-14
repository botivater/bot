import { SystemEventPattern } from '@common/common/SystemEventPattern.enum';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GuildMemberAddedDto } from '@common/common/SystemEventPatternDto/guild-member-added.dto';
import discord, {
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} from 'discord.js';
import { SendVerificationMessageDto } from './dto/send-verification-message.dto';
import { Discord } from '../../discord/discord';
import { MessageButtonStyles, TextInputStyles } from 'discord.js/typings/enums';
import { userMention } from '@discordjs/builders';
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
  ) {}

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

    if (sendVerificationMessageDto.type === 'channel') {
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

    if (sendVerificationMessageDto.type === 'user') {
      await this.discord.users.fetch(sendVerificationMessageDto.userSnowflake);

      const dmChannel = this.discord.users.cache.get(
        sendVerificationMessageDto.userSnowflake,
      );

      if (!dmChannel) throw new ChannelNotFoundError();

      await dmChannel.send({
        content: `Hey ${userMention(
          sendVerificationMessageDto.userSnowflake,
        )}! Verifieer jouw lidmaatschap alstublieft.`,
        components: [messageActionRow],
      });
    }
  }

  guildMemberAdded(guildMemberAddedDto: GuildMemberAddedDto) {
    this.lymeverenigingMemberCheckerService.emit<any, GuildMemberAddedDto>(
      SystemEventPattern.GUILD_MEMBER_ADDED,
      guildMemberAddedDto,
    );
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
      // if (isMember !== 'MEMBER') throw new VerificationModalNotAMemberError();

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

      const response = await new Promise((resolve, reject) => {
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

      await interaction.reply({
        content: `We hebben geverifieerd dat jij lid bent van de Lymevereniging! Bedankt!\nNu volgt er nog 1 stap voor je toegang krijgt tot de server. Er is een email gestuurd met een code om je email adres te verifieren, deze dien je hier in te vullen.`,
        ephemeral: true,
        components: [messageActionRow],
      });
    } catch (err) {
      if (err instanceof VerificationModalInvalidEmailError) {
        await interaction.reply({
          content: 'Oeps, dat is geen geldig email adres. Probeer het opnieuw.',
          ephemeral: true,
        });
      } else if (err instanceof VerificationModalNotAMemberError) {
        await interaction.reply({
          content:
            'Wij konden jouw lidmaatschap niet verifiëren. Probeer opnieuw, of neem contact op met iemand. Het kan ook zijn dat jouw lidmaatschap verlopen is.',
          ephemeral: true,
        });
      } else {
        this.logger.error(err);
        await interaction.reply({
          content:
            'Er is een intern probleem opgetreden! Gelieve contact op te nemen met Jonas Claes.',
          ephemeral: true,
        });
      }
    }
  }

  private async respondToEmailVerificationModal(
    interaction: discord.ModalSubmitInteraction<discord.CacheType>,
  ) {
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

      await interaction.reply({
        content: `We hebben jouw email adres geverifieerd! Bedankt! Je krijgt binnen enkele seconden toegang tot de server!`,
        ephemeral: true,
      });
    } catch (err) {
      if (err instanceof EmailVerificationModalInvalidCodeError) {
        await interaction.reply({
          content: 'Oeps, dat is geen geldige code. Probeer het opnieuw.',
          ephemeral: true,
        });
      } else if (err instanceof EmailVerificationModalCodeExpiredError) {
        await interaction.reply({
          content: 'Oeps, deze code is verlopen. Vraag een nieuwe code aan.',
          ephemeral: true,
        });
      } else {
        this.logger.error(err);
        await interaction.reply({
          content:
            'Er is een intern probleem opgetreden! Gelieve contact op te nemen met Jonas Claes.',
          ephemeral: true,
        });
      }
    }
  }
}
