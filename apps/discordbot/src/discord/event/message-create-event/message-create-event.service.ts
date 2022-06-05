import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'discord.js';
import { ActivityProvider } from '../../activity-provider';
import { Discord } from '../../discord';
import { SyncProvider } from '../../sync-provider';

@Injectable()
export class MessageCreateEventService {
  private readonly logger = new Logger(MessageCreateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    private readonly activityProvider: ActivityProvider,
    private readonly syncProvider: SyncProvider,
  ) {
    this.discord.on('messageCreate', this.handle.bind(this));
  }

  public async handle(message: Message<boolean>) {
    try {
      if (message.partial) await message.fetch();

      const { member, guild, createdTimestamp } = message;

      if (member.user.bot) return;

      const dbGuild = await this.syncProvider.guild(guild);
      const dbGuildMember = await this.syncProvider.guildMember(
        dbGuild,
        member,
      );

      await this.activityProvider.register({
        guildSnowflake: guild.id,
        guildMemberSnowflake: member.user.id,
        timestamp: new Date(createdTimestamp),
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
