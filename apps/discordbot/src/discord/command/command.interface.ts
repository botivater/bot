import discord from 'discord.js';
import builder from '@discordjs/builders';

export interface Command {
  setup(): builder.SlashCommandBuilder;
  handleCommand(
    interaction: discord.CommandInteraction<discord.CacheType>,
  ): Promise<void>;
  handleModalSubmit(
    interaction: discord.ModalSubmitInteraction<discord.CacheType>,
  ): Promise<void>;
}
