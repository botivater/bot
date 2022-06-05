import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import { Command } from '../command.interface';

@Injectable()
export class RecreateFlowsCommandService implements Command {
  private readonly logger = new Logger(RecreateFlowsCommandService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(CommandFlowGroup)
    private commandFlowGroupRepository: Repository<CommandFlowGroup>,
    private readonly discord: Discord,
  ) {}

  setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('recreate-flows')
      .setDescription('Recreate reaction flows.')
      .setDefaultPermission(false);
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const commandFlowGroups = await this.commandFlowGroupRepository.find({
        where: {
          guild: {
            snowflake: interaction.guild.id,
          },
        },
        order: {
          id: 'ASC',
        },
      });

      for (const commandFlowGroup of commandFlowGroups) {
        const channel = this.discord.channels.cache.get(
          commandFlowGroup.channelId,
        );
        if (!channel) throw new Error('Guild channel not found');
        if (!channel.isText())
          throw new Error('Guild channel is not a text channel');

        const messageSent = await channel.send(commandFlowGroup.messageText);
        for (const reaction of commandFlowGroup.reactions) {
          await messageSent.react(reaction);
        }

        await this.commandFlowGroupRepository.update(commandFlowGroup.id, {
          messageId: messageSent.id,
        });
      }

      await interaction.editReply('Done.');
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('An error occurred.');
    }
  }

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
