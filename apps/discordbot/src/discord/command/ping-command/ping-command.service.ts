import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command } from '../command.interface';

@Injectable()
export class PingCommandService implements Command {
  setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('ping')
      .setDescription("Respond with 'Pong!'")
      .setDefaultPermission(true);
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();
    await interaction.editReply('Pong!');
  }

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
