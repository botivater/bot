import { Injectable, Logger } from '@nestjs/common';
import { Discord } from '../../discord';
import discord from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from '@common/common/guild/guild.entity';
import { Repository } from 'typeorm';
import Handlebars from 'handlebars';

@Injectable()
export class GuildMemberAddEventService {
  private readonly logger = new Logger(GuildMemberAddEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
  ) {
    discord.on('guildMemberAdd', this.handle.bind(this));
  }

  public async handle(member: discord.GuildMember) {
    try {
      this.logger.debug(
        `User ${member.user.tag} joined guild ${member.guild.name}`,
      );

      const dbGuild = await this.guildRepository.findOne({
        where: {
          snowflake: member.guild.id,
        },
        relations: {
          guildConfig: true,
        },
      });
      if (!dbGuild) throw new Error('Guild not found');

      if (!dbGuild.guildConfig.welcomeMessageEnabled) return;
      if (!dbGuild.guildConfig.welcomeMessageConfig)
        throw new Error('Missing welcome message config');

      const {
        guildConfig: { welcomeMessageConfig },
      } = dbGuild;

      await this.discord.guilds.fetch(dbGuild.snowflake);
      const discordGuild = this.discord.guilds.cache.get(dbGuild.snowflake);
      if (!discordGuild) throw new Error('Could not get Discord guild');

      await discordGuild.channels.fetch(welcomeMessageConfig.channelSnowflake);
      const discordChannel = discordGuild.channels.cache.get(
        welcomeMessageConfig.channelSnowflake,
      );
      if (!discordChannel) throw new Error('Could not get Discord channel');
      if (!discordChannel.isText())
        throw new Error('Discord channel is not a text channel');

      const template = Handlebars.compile(welcomeMessageConfig.format);

      await discordChannel.send({
        content: template(
          {
            member,
          },
          {
            allowProtoPropertiesByDefault: true,
          },
        ),
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
