import { Injectable, Logger } from '@nestjs/common';
import { Discord } from '../../discord';
import discord, { ChannelType } from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from '@common/common/guild/guild.entity';
import { Repository } from 'typeorm';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';

@Injectable()
export class GuildCreateEventService {
  private readonly logger = new Logger(GuildCreateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
  ) {
    this.discord.on('guildCreate', this.handle.bind(this));
  }

  public async handle(discordGuild: discord.Guild) {
    const dbGuild = await this.guildRepository.findOneBy({
      snowflake: discordGuild.id,
    });
    if (dbGuild) return;

    const newGuild = new Guild();
    newGuild.snowflake = discordGuild.id;
    newGuild.name = discordGuild.name;
    newGuild.guildConfig = new GuildConfig();
    const guildChannel = await discordGuild.channels.create({
      type: ChannelType.GuildText,
      name: 'system',
    });
    newGuild.guildConfig.systemChannelId = guildChannel.id;
    await this.guildRepository.save(newGuild);

    this.logger.debug(`Guild ${discordGuild.name} created`);
  }
}
