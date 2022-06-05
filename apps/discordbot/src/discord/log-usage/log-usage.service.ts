import { CommandInvocation } from '@common/common/commandInvocation/commandInvocation.entity';
import { Guild } from '@common/common/guild/guild.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interaction } from 'discord.js';
import { Repository } from 'typeorm';

@Injectable()
export class LogUsageService {
  private readonly logger = new Logger(LogUsageService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(CommandInvocation)
    private commandInvocationRepository: Repository<CommandInvocation>,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
  ) {}

  async logInteraction(interaction: Interaction) {
    try {
      const dbGuildMember = await this.guildMemberRepository.findOne({
        where: {
          snowflake: interaction.member.user.id,
          guild: {
            snowflake: interaction.guild.id,
          },
        },
        relations: {
          guild: true,
        },
      });
      if (!dbGuildMember) throw new Error('Guild member not found');

      if (interaction.isCommand()) {
        await this.commandInvocationRepository.insert({
          guild: dbGuildMember.guild,
          guildMember: dbGuildMember,
          commandName: interaction.commandName,
        });
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
