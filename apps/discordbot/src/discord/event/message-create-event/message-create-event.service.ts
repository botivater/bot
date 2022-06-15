import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Message } from '@common/common/message/message.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import discord from 'discord.js';
import { Repository } from 'typeorm';
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
    @InjectRepository(GuildChannel)
    private readonly guildChannelRepository: Repository<GuildChannel>,
    @InjectRepository(GuildMember)
    private readonly guildMemberRepository: Repository<GuildMember>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    this.discord.on('messageCreate', this.handle.bind(this));
  }

  public async handle(message: discord.Message<boolean>) {
    try {
      if (message.partial) await message.fetch();

      if (message.inGuild()) {
        const { member, guild, createdTimestamp } = message;

        const guildChannel = await this.guildChannelRepository.findOneBy({
          snowflake: message.channelId,
        });

        const guildMember = await this.guildMemberRepository.findOneBy({
          snowflake: message.member.id,
        });

        const newMessage = new Message();
        newMessage.snowflake = message.id;
        newMessage.content = message.content;
        newMessage.guildChannel = guildChannel;
        newMessage.guildMember = guildMember;
        await this.messageRepository.save(newMessage);

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
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
