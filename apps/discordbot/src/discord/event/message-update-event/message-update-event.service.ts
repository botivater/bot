import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Message } from '@common/common/message/message.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import discord from 'discord.js';

@Injectable()
export class MessageUpdateEventService {
  private readonly logger = new Logger(MessageUpdateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(GuildChannel)
    private readonly guildChannelRepository: Repository<GuildChannel>,
    @InjectRepository(GuildMember)
    private readonly guildMemberRepository: Repository<GuildMember>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    this.discord.on('messageUpdate', this.handle.bind(this));
  }

  public async handle(
    oldMessage: discord.Message<boolean>,
    newMessage: discord.Message<boolean>,
  ) {
    try {
      if (oldMessage.partial) await oldMessage.fetch();
      if (newMessage.partial) await newMessage.fetch();

      if (newMessage.inGuild()) {
        const { member, channelId, createdAt, content } = newMessage;

        if (member.user.bot) return;

        const foundMessage = await this.messageRepository.findOne({
          where: { snowflake: oldMessage.id },
        });

        if (foundMessage) {
          foundMessage.content = content;
          await this.messageRepository.save(foundMessage);
        } else {
          const guildChannel = await this.guildChannelRepository.findOneBy({
            snowflake: channelId,
          });

          const guildMember = await this.guildMemberRepository.findOneBy({
            snowflake: member.id,
          });

          const newDbMessage = new Message();
          newDbMessage.createdAt = createdAt;
          newDbMessage.snowflake = newMessage.id;
          newDbMessage.content = content;
          newDbMessage.guildChannel = guildChannel;
          newDbMessage.guildMember = guildMember;
          await this.messageRepository.save(newDbMessage);
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
