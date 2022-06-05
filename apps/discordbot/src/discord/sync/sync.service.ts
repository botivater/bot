import { Guild } from '@common/common/guild/guild.entity';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { bold, userMention } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discord } from '../discord';
import { PronounChecker } from '../helper/pronoun-checker';
import { SystemMessageChannelService } from '../message-channel/system-message-channel/system-message-channel.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
    private readonly systemMessageChannelService: SystemMessageChannelService,
  ) {
    // Manually trigger on startup
    this.handleCron();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  protected async handleCron() {
    this.logger.verbose('Running cron job');

    await this.discord.guilds.fetch();

    const removableGuilds = await this.compareDatabaseGuildsToDiscordGuilds();
    this.logger.debug(
      `Removable guilds: [${removableGuilds.map(
        (v) => `${v.name} (${v.snowflake})`,
      )}]`,
    );
    await this.guildRepository.remove(removableGuilds);

    const addableGuilds = await this.compareDiscordGuildsToDatabaseGuilds();
    this.logger.debug(
      `Addable guilds: [${addableGuilds.map(
        (v) => `${v.name} (${v.snowflake})`,
      )}]`,
    );
    await this.guildRepository.save(addableGuilds);

    await Promise.all(
      this.discord.guilds.cache.map((discordGuild) =>
        discordGuild.members.fetch(),
      ),
    );

    const removeableGuildMembers =
      await this.compareDatabaseGuildMembersToDiscordGuildMembers();
    this.logger.debug(
      `Removable guild members: [${removeableGuildMembers.map(
        (v) => `${v.name} (${v.snowflake})`,
      )}]`,
    );
    await this.guildMemberRepository.remove(removeableGuildMembers);

    const addableGuildMembers =
      await this.compareDiscordGuildMembersToDatabaseGuildMembers();
    this.logger.debug(
      `Addable guild members: [${addableGuildMembers.map(
        (v) => `${v.name} (${v.snowflake})`,
      )}]`,
    );
    await this.guildMemberRepository.save(addableGuildMembers);

    await this.checkPronouns();

    this.logger.verbose('Finished cron job');
  }

  protected async compareDatabaseGuildsToDiscordGuilds() {
    const removeableGuilds: Guild[] = [];
    const databaseGuilds = await this.guildRepository.find();

    for (const databaseGuild of databaseGuilds) {
      const found = this.discord.guilds.cache.get(databaseGuild.snowflake);
      if (!found) removeableGuilds.push(databaseGuild);
    }

    return removeableGuilds;
  }

  protected async compareDiscordGuildsToDatabaseGuilds() {
    const addableGuilds: Guild[] = [];

    for await (const discordGuild of this.discord.guilds.cache.values()) {
      const found = await this.guildRepository.findOneBy({
        snowflake: discordGuild.id,
      });
      if (!found) {
        const newGuild = new Guild();
        newGuild.snowflake = discordGuild.id;
        newGuild.name = discordGuild.name;
        newGuild.guildConfig = new GuildConfig();
        const guildChannel = await discordGuild.channels.create('system', {
          type: 'GUILD_TEXT',
        });
        newGuild.guildConfig.systemChannelId = guildChannel.id;
        addableGuilds.push(newGuild);
      }
    }

    return addableGuilds;
  }

  protected async compareDatabaseGuildMembersToDiscordGuildMembers(): Promise<
    GuildMember[]
  > {
    const removeableGuildMembers: GuildMember[] = [];

    const databaseGuilds = await this.guildRepository.find({
      relations: {
        guildMembers: true,
      },
    });
    for (const databaseGuild of databaseGuilds) {
      for (const databaseGuildMember of databaseGuild.guildMembers) {
        try {
          const discordGuild = this.discord.guilds.cache.get(
            databaseGuild.snowflake,
          );
          if (!discordGuild) throw new Error('Guild not found');

          const found = discordGuild.members.cache.get(
            databaseGuildMember.snowflake,
          );
          if (!found) removeableGuildMembers.push(databaseGuildMember);
        } catch (e) {
          this.logger.error(e);
        }
      }
    }

    return removeableGuildMembers;
  }

  private async compareDiscordGuildMembersToDatabaseGuildMembers(): Promise<
    GuildMember[]
  > {
    const addableGuildMembers: GuildMember[] = [];

    for await (const discordGuild of this.discord.guilds.cache.values()) {
      try {
        const databaseGuild = await this.guildRepository.findOne({
          where: {
            snowflake: discordGuild.id,
          },
        });
        if (!databaseGuild) throw new Error('Database guild not found!');

        for await (const discordGuildMember of discordGuild.members.cache.values()) {
          if (discordGuildMember.user.bot) continue;
          const found = await this.guildMemberRepository.findOne({
            where: {
              snowflake: discordGuildMember.id,
            },
          });

          if (!found) {
            const newGuildMember = new GuildMember();
            newGuildMember.snowflake = discordGuildMember.id;
            newGuildMember.guild = databaseGuild;
            newGuildMember.name = discordGuildMember.displayName;
            newGuildMember.identifier = discordGuildMember.user.tag;

            addableGuildMembers.push(newGuildMember);
          }
        }
      } catch (e) {
        this.logger.error(e);
      }
    }

    return addableGuildMembers;
  }

  protected async checkPronouns() {
    const databaseGuilds = await this.guildRepository.find({
      where: {
        guildConfig: {
          pronounCheckEnabled: true,
        },
      },
      relations: {
        guildConfig: true,
        guildMembers: true,
      },
    });

    await Promise.all(
      databaseGuilds.map(async (databaseGuild) => {
        const discordGuild = this.discord.guilds.cache.get(
          databaseGuild.snowflake,
        );
        if (!discordGuild) throw new Error('Discord guild not found');

        await Promise.all(
          databaseGuild.guildMembers.map(async (databaseGuildMember) => {
            const discordGuildMember = discordGuild.members.cache.get(
              databaseGuildMember.snowflake,
            );
            if (!discordGuildMember)
              throw new Error('Discord guild member not found');

            this.logger.debug(
              `Checking pronouns of user ${databaseGuildMember.identifier}`,
            );

            if (databaseGuildMember.name !== discordGuildMember.displayName) {
              // Check if the username or the nickname contain valid pronouns.
              const hasValidPronouns = PronounChecker.checkString(
                discordGuildMember.displayName,
              );

              let message = ``;
              message += `Iemands naam is veranderd.\n`;
              message += `Gebruiker: ${userMention(
                databaseGuildMember.snowflake,
              )} (${databaseGuildMember.identifier}).\n`;
              message += `Oude naam: ${databaseGuildMember.name}.\n`;
              message += `Nieuwe naam: ${discordGuildMember.displayName}.\n`;
              message += `Pronouns zijn ${bold(
                hasValidPronouns ? 'in orde.' : 'niet in orde!',
              )}`;

              try {
                await this.systemMessageChannelService.send(
                  databaseGuild,
                  message,
                );
              } catch (e) {
                this.logger.error(e);
              }

              await this.guildMemberRepository.update(databaseGuildMember.id, {
                name: discordGuildMember.displayName,
              });
            }
          }),
        );
      }),
    );
  }
}
