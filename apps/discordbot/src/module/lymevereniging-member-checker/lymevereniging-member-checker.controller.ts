import { Controller, Logger } from '@nestjs/common';
import { Discord } from '../../discord/discord';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';
import discord from 'discord.js';
import { SendVerificationMessageDto } from './dto/send-verification-message.dto';

@Controller()
export class LymeverenigingMemberCheckerController {
  private readonly logger = new Logger(
    LymeverenigingMemberCheckerController.name,
  );

  constructor(
    private readonly discord: Discord,
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {
    this.discord.on('interactionCreate', this.interactionCreated.bind(this));
    this.logger.debug('LymeverenigingMemberCheckerController initialized');
    // this.sendVerificationMessage({
    //   channelSnowflake: '995777397876068473',
    // });
  }

  async sendVerificationMessage(
    sendVerificationMessageDto: SendVerificationMessageDto,
  ) {
    this.lymeverenigingMemberCheckerService.sendVerificationMessage(
      sendVerificationMessageDto,
    );
  }

  async interactionCreated(
    interaction: discord.Interaction<discord.CacheType>,
  ) {
    if (interaction.isButton()) {
      return this.lymeverenigingMemberCheckerService.buttonInteractionCreated(
        interaction,
      );
    }

    if (interaction.isModalSubmit()) {
      return this.lymeverenigingMemberCheckerService.modalSubmitInteractionCreated(
        interaction,
      );
    }
  }
}
