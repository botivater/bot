import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { CacheType, CommandInteraction } from 'discord.js';
import { Command } from '../command';

@Injectable()
export class AskAnonymouslyCommandService extends Command {
  private readonly logger = new Logger(AskAnonymouslyCommandService.name);

  public COMMAND_NAME = 'ask-anonymously';

  /**
   *
   */
  constructor() {
    super();
  }

  public setup(): SlashCommandBuilder {
    const questionOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('question')
        .setNameLocalization('nl', 'vraag')
        .setDescription('The question to ask')
        .setDescriptionLocalization('nl', 'De vraag die je wilt stellen')
        .setRequired(true);

    return new SlashCommandBuilder()
      .setName(this.COMMAND_NAME)
      .setNameLocalization('nl', 'vraag-anoniem')
      .setDescription('Ask a question anonymously in the current channel')
      .setDescriptionLocalization('nl', 'Stel een anonieme vraag in dit kanaal')
      .addStringOption(questionOption)
      .setDefaultPermission(true);
  }

  public async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const question = interaction.options.getString('question');
      if (!question) throw new Error('No question provided');

      await interaction.editReply(
        `I'm going to ask your question anonymously now.`,
      );

      await interaction.channel.send(`Someone asked: ${question}`);
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply(err);
    }
  }
}
