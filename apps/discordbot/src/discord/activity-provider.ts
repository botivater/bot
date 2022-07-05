import { Guild } from '@common/common/guild/guild.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from './discord';

@Injectable()
export class ActivityProvider {
  private readonly logger = new Logger(ActivityProvider.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild)
    private guildRepository: Repository<Guild>,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
    private readonly discord: Discord,
  ) {}

  public async register(data: {
    guildSnowflake: string;
    guildMemberSnowflake: string;
    timestamp: Date;
  }) {
    try {
      const { guildSnowflake, guildMemberSnowflake, timestamp } = data;

      const dbGuildMember = await this.guildMemberRepository.findOneBy({
        snowflake: guildMemberSnowflake,
        guild: {
          snowflake: guildSnowflake,
        },
      });

      if (!dbGuildMember) throw new Error('Guild member not found');

      dbGuildMember.lastInteraction = timestamp;
      dbGuildMember.isActive = true;

      await this.guildMemberRepository.save(dbGuildMember);

      const dbGuild = await this.guildRepository.findOne({
        where: {
          snowflake: guildSnowflake,
        },
        relations: {
          guildConfig: true,
        },
      });

      // Check user Discord roles for inactive/active
      if (
        dbGuild.guildConfig.inactivityCheckEnabled &&
        dbGuild.guildConfig.inactivityCheckConfig
      ) {
        this.logger.debug(
          `Checking role for user: ${dbGuildMember.identifier}`,
        );

        await this.discord.guilds.fetch(guildSnowflake);
        const guild = this.discord.guilds.cache.get(guildSnowflake);
        if (!guild) throw new Error('Guild not found');

        await guild.members.fetch(guildMemberSnowflake);
        const guildMember = guild.members.cache.get(guildMemberSnowflake);
        if (!guildMember) throw new Error('Guild member not found');

        const hasInactiveRole = !!guildMember.roles.cache.get(
          dbGuild.guildConfig.inactivityCheckConfig.inactiveRoleId,
        );
        const hasActiveRole = !!guildMember.roles.cache.get(
          dbGuild.guildConfig.inactivityCheckConfig.activeRoleId,
        );

        this.logger.debug(
          `User "${dbGuildMember.identifier}" ${
            hasInactiveRole ? 'has' : "doesn't have"
          } inactive role`,
        );

        if (hasInactiveRole) {
          await guildMember.roles.remove(
            dbGuild.guildConfig.inactivityCheckConfig.inactiveRoleId,
          );
        }

        // Uncommented by Jonas Claes.
        // The role should not be automatically re-added.

        // this.logger.debug(
        //   `User "${dbGuildMember.identifier}" ${
        //     hasActiveRole ? 'has' : "doesn't have"
        //   } active role`,
        // );

        // if (!hasActiveRole) {
        //   await guildMember.roles.add(
        //     dbGuild.guildConfig.inactivityCheckConfig.activeRoleId,
        //   );
        // }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
