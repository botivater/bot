import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../command';

@Injectable()
export class AbbreviationCommandService extends Command {
  public COMMAND_NAME = 'abbreviation';

  public setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('abbreviation')
      .setDescription('Toon de lijst met afkortingen.')
      .setDefaultPermission(true);
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    await interaction.editReply({
      files: [
        'https://static.jonasclaes.be/botivater-resources/afkortingen.jpg',
      ],
    });
  }
}
