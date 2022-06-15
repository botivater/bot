import { Injectable, Logger } from '@nestjs/common';
import discord from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';

@Injectable()
export class ChannelDeleteEventService {
  private readonly logger = new Logger(ChannelDeleteEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(GuildChannel)
    private readonly guildChannelRepository: Repository<GuildChannel>,
  ) {
    this.discord.on('channelDelete', this.handle.bind(this));
  }

  public async handle(
    discordGuildChannel: discord.DMChannel | discord.NonThreadGuildBasedChannel,
  ) {
    try {
      const dbGuildChannel = await this.guildChannelRepository.findOneByOrFail({
        snowflake: discordGuildChannel.id,
      });

      await this.guildChannelRepository.delete(dbGuildChannel.id);

      this.logger.debug(`Guild channel ${dbGuildChannel.name} deleted`);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
