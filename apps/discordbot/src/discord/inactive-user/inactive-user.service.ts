import { Guild } from '@common/common/guild/guild.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { bold, userMention } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Discord } from '../discord';

@Injectable()
export class InactiveUserService {
  private readonly logger = new Logger(InactiveUserService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
  ) {
    this.handleCron();
  }

  @Cron(CronExpression.EVERY_HOUR)
  protected async handleCron() {
    this.logger.verbose('Running cron job');

    try {
      const now = new Date().getTime();
      const databaseGuilds = await this.guildRepository.find({
        where: {
          guildConfig: {
            inactivityCheckEnabled: true,
          },
        },
        relations: {
          guildConfig: true,
        },
      });

      await Promise.all(
        databaseGuilds.map(async (databaseGuild) => {
          const comparisonDate = new Date(
            now -
              databaseGuild.guildConfig.inactivityCheckConfig
                .inactiveUserSeconds *
                1000,
          );

          const databaseGuildMembers = await this.guildMemberRepository.find({
            where: {
              isActive: true,
              lastInteraction: LessThanOrEqual(comparisonDate),
              guild: {
                id: databaseGuild.id,
              },
            },
          });

          this.logger.debug(
            `Following users are inactive for more than ${
              databaseGuild.guildConfig.inactivityCheckConfig
                .inactiveUserSeconds
            } seconds: [${databaseGuildMembers.map(
              (v) => `${v.name} (${v.identifier})`,
            )}]`,
          );

          const guild = this.discord.guilds.cache.get(databaseGuild.snowflake);
          if (!guild) {
            this.logger.error('Guild not found');
            return;
          }

          await guild.channels.fetch(databaseGuild.guildConfig.systemChannelId);
          const guildChannel = guild.channels.cache.get(
            databaseGuild.guildConfig.systemChannelId,
          );
          if (!guildChannel) {
            this.logger.error('Guild channel not found');
            return;
          }

          if (!guildChannel.isText()) {
            this.logger.error('Guild channel not a text channel');
            return;
          }

          await Promise.all(
            databaseGuildMembers.map(async (databaseGuildMember) => {
              if (databaseGuildMember.lastInteraction === undefined) return;

              this.logger.verbose(
                `Setting user '${databaseGuildMember.name}' with uid '${databaseGuildMember.snowflake}' to inactive.`,
              );

              const discordGuildMember = guild.members.cache.get(
                databaseGuildMember.snowflake,
              );
              if (!discordGuildMember) {
                this.logger.error('Guild member not found');
                return;
              }

              let message = `${bold('Ik heb iemand op non-actief gezet.')}\r\n`;
              message += `Gebruiker: ${userMention(
                databaseGuildMember.snowflake,
              )} (${databaseGuildMember.identifier})\r\n`;
              message += `Laatste interactie: ${databaseGuildMember.lastInteraction?.toLocaleDateString(
                'nl-NL',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}\r\n`;
              message += `Ik heb deze persoon de rol 'Non-Actief' toegewezen. *LET OP! Gelieve zelf te checken of deze persoon de privérollen nog heeft, indien ja, verwijder deze. In de toekomst zal de bot dit zelf kunnen.*`;

              guildChannel.send({
                content: message,
                allowedMentions: {
                  parse: [],
                },
              });

              await this.guildMemberRepository.update(databaseGuildMember.id, {
                isActive: false,
              });

              await discordGuildMember.roles.add(
                databaseGuild.guildConfig.inactivityCheckConfig.inactiveRoleId,
              );
              await discordGuildMember.roles.remove(
                databaseGuild.guildConfig.inactivityCheckConfig.activeRoleId,
              );
            }),
          );
        }),
      );
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.verbose('Finished cron job');
  }
}
