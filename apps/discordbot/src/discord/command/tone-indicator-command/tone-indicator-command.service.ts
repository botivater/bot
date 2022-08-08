import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../command';

@Injectable()
export class ToneIndicatorCommandService extends Command {
  public COMMAND_NAME = 'toneindicator';

  public setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('toneindicator')
      .setDescription('Toon de lijst met tone indicators.')
      .setDefaultPermission(true);
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    await interaction.editReply({
      files: [
        'https://static.jonasclaes.be/botivater-resources/tone-indicator.jpg',
      ],
    });
  }
}
