import { Guild } from '@common/common/guild/guild.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import discord from 'discord.js';

@Injectable()
export class GuildMemberRemoveEventService {
  private readonly logger = new Logger(GuildMemberRemoveEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
  ) {
    this.discord.on('guildMemberRemove', this.handle.bind(this));
  }

  public async handle(member: discord.GuildMember) {
    try {
      this.logger.debug(
        `User ${member.user.tag} left guild ${member.guild.name}`,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
