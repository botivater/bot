import discord from 'discord.js';
import builder from '@discordjs/builders';

export abstract class Command {
  public abstract COMMAND_NAME: string;

  public abstract setup(): builder.SlashCommandBuilder;

  public async handleCommand(
    interaction: discord.CommandInteraction<discord.CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async handleModalSubmit(
    interaction: discord.ModalSubmitInteraction<discord.CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
