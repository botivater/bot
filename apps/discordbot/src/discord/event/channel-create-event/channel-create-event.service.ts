import { Injectable, Logger } from '@nestjs/common';
import discord from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';
import { Guild } from '@common/common/guild/guild.entity';

@Injectable()
export class ChannelCreateEventService {
  private readonly logger = new Logger(ChannelCreateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
    @InjectRepository(GuildChannel)
    private readonly guildChannelRepository: Repository<GuildChannel>,
  ) {
    this.discord.on('channelCreate', this.handle.bind(this));
  }

  public async handle(discordGuildChannel: discord.NonThreadGuildBasedChannel) {
    try {
      const dbGuild = await this.guildRepository.findOneByOrFail({
        snowflake: discordGuildChannel.guildId,
      });

      const newGuildChannel = new GuildChannel();
      newGuildChannel.guild = dbGuild;
      newGuildChannel.snowflake = discordGuildChannel.id;
      newGuildChannel.name = discordGuildChannel.name;
      newGuildChannel.type = discordGuildChannel.type;
      await this.guildChannelRepository.save(newGuildChannel);

      this.logger.debug(`Guild channel ${newGuildChannel.name} created`);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
