import { Observable } from 'rxjs';
import { BotGuildChannel } from './bot-guild-channel.interface';
import { BotGuildMember } from './bot-guild-member.interface';
import { BotGuildRole } from './bot-guild-role.interface';
import { BotSpeakRequest } from './bot-speak-request.interface';
import { BotSpeakResponse } from './bot-speak-response.interface';

export interface BotService {
  ping(data: { id: number }): Observable<{ id: number }>;
  getGuildChannels(data: { guildId: number }): Observable<BotGuildChannel[]>;
  getGuildMembers(data: { guildId: number }): Observable<BotGuildMember[]>;
  getGuildRoles(data: { guildId: number }): Observable<BotGuildRole[]>;
  speak(data: BotSpeakRequest): Observable<BotSpeakResponse>;
}
