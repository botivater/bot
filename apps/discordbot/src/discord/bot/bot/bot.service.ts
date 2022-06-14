import { Guild } from '@common/common/guild/guild.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandService } from '../../command/command.service';
import { Discord } from '../../discord';
import { IBotService } from '../interface/bot-service.interface';
import { GuildChannel } from '../interface/guild-channel.interface';
import { GuildMember } from '../interface/guild-member.interface';
import { GuildRole } from '../interface/guild-role.interface';

export class NotFoundError extends Error {}

@Injectable()
export class BotService implements IBotService {
  private readonly logger = new Logger(BotService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
    private readonly commandService: CommandService,
    private readonly discord: Discord,
  ) {}

  async loadAllGuildsCommands(): Promise<void> {
    const databaseGuilds = await this.guildRepository.find();

    await this.commandService.putGuildsCommands(databaseGuilds);
  }

  async loadGuildCommands(guildId: number): Promise<void> {
    const databaseGuild = await this.guildRepository.findOneBy({
      id: guildId,
    });
    if (!databaseGuild) throw new NotFoundError();

    await this.commandService.putGuildCommands(databaseGuild);
  }

  async getGuildChannels(id: number): Promise<GuildChannel[]> {
    const guild = await this.guildRepository.findOneBy({ id });
    if (!guild) throw new NotFoundError();
    await this.discord.guilds.fetch(guild.snowflake);
    const discordGuild = this.discord.guilds.cache.get(guild.snowflake);
    await discordGuild.channels.fetch();
    return discordGuild.channels.cache
      .filter((c) => c.isText() || c.isVoice())
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      }));
  }

  async getGuildMembers(id: number): Promise<GuildMember[]> {
    const guild = await this.guildRepository.findOneBy({ id });
    if (!guild) throw new NotFoundError();
    await this.discord.guilds.fetch(guild.snowflake);
    const discordGuild = this.discord.guilds.cache.get(guild.snowflake);
    await discordGuild.members.fetch();
    return discordGuild.members.cache
      .filter((m) => !m.user.bot)
      .map((member) => ({
        userId: member.user.id,
        displayName: member.displayName,
        displayAvatarUrl: member.displayAvatarURL(),
        nickname: member.nickname,
        roles: member.roles.cache.map((r) => r.id),
      }));
  }

  async getGuildRoles(id: number): Promise<GuildRole[]> {
    const guild = await this.guildRepository.findOneBy({ id });
    if (!guild) throw new NotFoundError();
    await this.discord.guilds.fetch(guild.snowflake);
    const discordGuild = this.discord.guilds.cache.get(guild.snowflake);
    await discordGuild.roles.fetch();
    return discordGuild.roles.cache.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  async speak(channelSnowflake: string, message: string): Promise<void> {
    await this.discord.channels.fetch(channelSnowflake);
    const channel = this.discord.channels.cache.get(channelSnowflake);
    if (!channel) throw new NotFoundError();
    if (!channel.isText()) throw new NotFoundError();

    await channel.send(message);
  }
}
