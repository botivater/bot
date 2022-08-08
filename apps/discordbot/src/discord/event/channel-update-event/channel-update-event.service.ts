import { Injectable, Logger } from '@nestjs/common';
import discord, { ChannelType, DMChannel } from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';

@Injectable()
export class ChannelUpdateEventService {
  private readonly logger = new Logger(ChannelUpdateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(GuildChannel)
    private readonly guildChannelRepository: Repository<GuildChannel>,
  ) {
    this.discord.on('channelUpdate', this.handle.bind(this));
  }

  public async handle(
    oldDiscordGuildChannel:
      | discord.DMChannel
      | discord.NonThreadGuildBasedChannel,
    newDiscordGuildChannel:
      | discord.DMChannel
      | discord.NonThreadGuildBasedChannel,
  ) {
    try {
      if (newDiscordGuildChannel instanceof DMChannel) return;

      const dbGuild = await this.guildChannelRepository.findOneByOrFail({
        snowflake: oldDiscordGuildChannel.id,
      });

      dbGuild.snowflake = newDiscordGuildChannel.id;
      dbGuild.name = newDiscordGuildChannel.name;
      dbGuild.type = ChannelType[newDiscordGuildChannel.type];
      await this.guildChannelRepository.save(dbGuild);

      this.logger.debug(`Guild channel ${dbGuild.name} updated`);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
