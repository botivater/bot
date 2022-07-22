import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { userMention } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Discord } from '../discord';
import Handlebars from 'handlebars';

@Injectable()
export class BirthdayService {
  private readonly logger = new Logger(BirthdayService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  protected async handleCron() {
    this.logger.verbose(`Running cron job`);

    const dbGuildMembers = await this.guildMemberRepository.find({
      where: {
        birthday: Raw(
          (alias) =>
            `DATE_FORMAT(${alias}, '%m-%d') = DATE_FORMAT(NOW(), '%m-%d')`,
        ),
      },
      relations: {
        guild: {
          guildConfig: true,
        },
      },
    });

    for await (const dbGuildMember of dbGuildMembers) {
      try {
        const discordGuild = this.discord.guilds.cache.get(
          dbGuildMember.guild.snowflake,
        );
        if (!discordGuild) throw new Error('Guild not found');

        const discordGuildMember = discordGuild.members.cache.get(
          dbGuildMember.snowflake,
        );
        if (!discordGuildMember) throw new Error('Guild member not found');

        if (!dbGuildMember.guild.guildConfig.announcementChannelId) continue;

        const discordGuildChannel = discordGuild.channels.cache.get(
          dbGuildMember.guild.guildConfig.announcementChannelId,
        );
        if (!discordGuildChannel) throw new Error('Guild channel not found');
        if (!discordGuildChannel.isTextBased())
          throw new Error('Guild channel is not a text channel');

        const options = [
          'Happy birthday to you, {{{ person }}}!',
          'Gelukkige verjaardag, {{{ person }}}!',
          'Er is er één jarig! Happy birthday, {{{ person }}}!',
          'Gefeliciteerd met je verjaardag, {{{ person }}}!',
        ];

        const option =
          options[Math.round(Math.random() * (options.length - 1))];

        const stringTemplate = Handlebars.compile(option);

        discordGuildChannel.send({
          content: stringTemplate({
            person: userMention(discordGuildMember.id),
          }),
        });

        this.logger.debug(
          `Sent birthday message of user: ${dbGuildMember.name} (${dbGuildMember.identifier}).`,
        );
      } catch (err) {
        this.logger.error(err);
      }
    }

    this.logger.verbose(`Finished cron job`);
  }
}
