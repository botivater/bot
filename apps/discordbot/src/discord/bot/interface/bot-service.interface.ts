import { GuildChannel } from './guild-channel.interface';
import { GuildMember } from './guild-member.interface';
import { GuildRole } from './guild-role.interface';

export interface IBotService {
  loadAllGuildsCommands(): Promise<void>;
  loadGuildCommands(guildId: number): Promise<void>;
  getGuildChannels(id: number): Promise<GuildChannel[]>;
  getGuildMembers(id: number): Promise<GuildMember[]>;
  getGuildRoles(id: number): Promise<GuildRole[]>;
  speak(channelSnowflake: string, message: string): Promise<void>;
  createMessageWithReactions(
    channelSnowflake: string,
    message: string,
    reactions: string[],
  ): Promise<string>;
}
