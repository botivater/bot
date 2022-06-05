import { Guild } from '@common/common/guild/guild.entity';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import discord from 'discord.js';
import { Repository } from 'typeorm';

@Injectable()
export class SyncProvider {
  private readonly logger = new Logger(SyncProvider.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
    @InjectRepository(GuildConfig)
    private guildConfigRepository: Repository<GuildConfig>,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
  ) {}

  public async guild(guild: discord.Guild): Promise<Guild> {
    const dbGuild = await this.guildRepository.findOneBy({
      snowflake: guild.id,
    });

    if (dbGuild) return dbGuild;

    const newGuild = new Guild();
    newGuild.snowflake = guild.id;
    newGuild.name = guild.name;
    newGuild.guildConfig = new GuildConfig();
    const guildChannel = await guild.channels.create('system', {
      type: 'GUILD_TEXT',
    });
    newGuild.guildConfig.systemChannelId = guildChannel.id;
    await this.guildRepository.save(newGuild);

    return newGuild;
  }

  public async guildMember(
    dbGuild: Guild,
    guildMember: discord.GuildMember,
  ): Promise<GuildMember> {
    const dbGuildMember = await this.guildMemberRepository.findOneBy({
      snowflake: guildMember.id,
      guild: {
        snowflake: guildMember.guild.id,
      },
    });

    if (dbGuildMember) return dbGuildMember;

    const newGuildMember = new GuildMember();
    newGuildMember.snowflake = guildMember.id;
    newGuildMember.name = guildMember.displayName;
    newGuildMember.identifier = guildMember.user.tag;
    newGuildMember.guild = dbGuild;
    await this.guildMemberRepository.save(newGuildMember);
  }
}
