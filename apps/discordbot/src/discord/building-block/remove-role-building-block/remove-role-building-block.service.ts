import { Injectable, Logger } from '@nestjs/common';
import { Discord } from '../../discord';

@Injectable()
export class RemoveRoleBuildingBlockService {
  private readonly logger = new Logger(RemoveRoleBuildingBlockService.name);

  /**
   *
   */
  constructor(private readonly discord: Discord) {}

  public async handle(configuration: {
    guildSnowflake: string;
    guildMemberSnowflake: string;
    roleSnowflake: string;
  }) {
    try {
      const { guildSnowflake, guildMemberSnowflake, roleSnowflake } =
        configuration;

      await this.discord.guilds.fetch(guildSnowflake);

      const guild = this.discord.guilds.cache.get(guildSnowflake);
      if (!guild) throw new Error('Guild not found');

      await Promise.all([
        guild.members.fetch(guildMemberSnowflake),
        guild.roles.fetch(roleSnowflake),
      ]);

      const guildMember = guild.members.cache.get(guildMemberSnowflake);
      if (!guildMember) throw new Error('Guild member not found');

      const guildRole = guild.roles.cache.get(roleSnowflake);
      if (!guildRole) throw new Error('Guild role not found');

      await guildMember.roles.remove(roleSnowflake);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
