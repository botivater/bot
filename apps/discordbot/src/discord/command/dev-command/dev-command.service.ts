import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../command';

@Injectable()
export class DevCommandService extends Command {
  public COMMAND_NAME = 'dev';

  public setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('dev')
      .setDescription('Informatie over de ontwikkelaar.')
      .setDefaultPermission(true);
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    let content = '';
    content +=
      'Ik ben gemaakt en word onderhouden door Jonas Claes (jonasclaes#5870)!';
    content +=
      '\nJe kan op deze link meer informatie over hem vinden: <https://jonasclaes.be>';
    content +=
      '\nJe kan mijn bits en bytes op deze link vinden: <https://github.com/botivater/bot>';

    await interaction.editReply({
      content,
    });
  }
}
