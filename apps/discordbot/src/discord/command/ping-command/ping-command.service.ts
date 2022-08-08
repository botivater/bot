import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../command';

@Injectable()
export class PingCommandService extends Command {
  public COMMAND_NAME = 'ping';

  public setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('ping')
      .setDescription("Respond with 'Pong!'")
      .setDefaultPermission(true);
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();
    await interaction.editReply('Pong!');
  }
}
