import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command } from '../command.interface';

@Injectable()
export class DevCommandService implements Command {
  setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('dev')
      .setDescription('Informatie over de ontwikkelaar.')
      .setDefaultPermission(true);
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
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

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
