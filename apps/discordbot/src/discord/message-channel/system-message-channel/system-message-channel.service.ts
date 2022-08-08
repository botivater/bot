import { Guild } from '@common/common/guild/guild.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ChannelType } from 'discord.js';
import { Discord } from '../../discord';
import { MessageChannel } from '../message-channel.interface';

@Injectable()
export class SystemMessageChannelService implements MessageChannel {
  private readonly logger = new Logger(SystemMessageChannelService.name);

  /**
   *
   */
  constructor(private readonly discord: Discord) {}

  async send(guild: Guild, message: string): Promise<void> {
    try {
      await this.discord.guilds.fetch(guild.snowflake);

      const discordGuild = this.discord.guilds.cache.get(guild.snowflake);
      if (!discordGuild) throw new Error('Discord guild not found');

      await discordGuild.channels.fetch();

      const discordChannel = discordGuild.channels.cache.get(
        guild.guildConfig.systemChannelId,
      );
      if (!discordChannel) throw new Error('Discord guild channel not found');
      if (discordChannel.type !== ChannelType.GuildText) {
        throw new Error('Discord guild channel is not a text channel');
      }

      await discordChannel.send({
        content: message,
        allowedMentions: {
          parse: [],
        },
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
