import { Injectable, Logger } from '@nestjs/common';
import { Discord } from '../../discord';
import discord from 'discord.js';
import { SyncProvider } from '../../sync-provider';
import { ActivityProvider } from '../../activity-provider';

@Injectable()
export class VoiceStateUpdateEventService {
  private readonly logger = new Logger(VoiceStateUpdateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    private readonly syncProvider: SyncProvider,
    private readonly activityProvider: ActivityProvider,
  ) {
    this.discord.on('voiceStateUpdate', this.handle.bind(this));
  }

  public async handle(
    oldState: discord.VoiceState,
    newState: discord.VoiceState,
  ) {
    try {
      const { guild, member } = newState;

      if (member.user.bot) return;

      const dbGuild = await this.syncProvider.guild(guild);
      const dbGuildMember = await this.syncProvider.guildMember(
        dbGuild,
        member,
      );

      await this.activityProvider.register({
        guildSnowflake: guild.id,
        guildMemberSnowflake: member.user.id,
        timestamp: new Date(),
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
