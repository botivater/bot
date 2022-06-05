import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command } from '../command.interface';

@Injectable()
export class ToneIndicatorCommandService implements Command {
  setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('toneindicator')
      .setDescription('Toon de lijst met tone indicators.')
      .setDefaultPermission(true);
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    await interaction.editReply({
      files: [
        'https://static.jonasclaes.be/botivater-resources/tone-indicator.jpg',
      ],
    });
  }

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
