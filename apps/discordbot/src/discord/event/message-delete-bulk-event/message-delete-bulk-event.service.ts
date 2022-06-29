import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Message } from '@common/common/message/message.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import discord from 'discord.js';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';

@Injectable()
export class MessageDeleteBulkEventService {
  private readonly logger = new Logger(MessageDeleteBulkEventService.name);

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
    this.discord.on('messageDeleteBulk', this.handle.bind(this));
  }

  public async handle(
    messages: discord.Collection<
      string,
      discord.Message<boolean> | discord.PartialMessage
    >,
  ) {
    await Promise.all(
      messages.map(async (message) => {
        try {
          if (message.partial) await message.fetch();

          if (message.inGuild()) {
            const { member, channelId, createdAt, content } = message;

            if (member.user.bot) return;

            const foundMessage = await this.messageRepository.findOne({
              where: { snowflake: message.id },
            });

            if (foundMessage) {
              foundMessage.isRemovedOnDiscord = true;
              await this.messageRepository.save(foundMessage);
            } else {
              const guildChannel = await this.guildChannelRepository.findOneBy({
                snowflake: channelId,
              });

              const guildMember = await this.guildMemberRepository.findOneBy({
                snowflake: member.id,
              });

              const newMessage = new Message();
              newMessage.createdAt = createdAt;
              newMessage.snowflake = message.id;
              newMessage.content = content;
              newMessage.guildChannel = guildChannel;
              newMessage.guildMember = guildMember;
              newMessage.isRemovedOnDiscord = true;
              await this.messageRepository.save(newMessage);
            }
          }
        } catch (err) {
          this.logger.error(err);
        }
      }),
    );
  }
}
