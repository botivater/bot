import { CreateMessageWithReactionRequest } from 'apps/discordbot/src/discord/bot/interface/create-message-with-reaction-request.interface';
import { CreateMessageWithReactionResponse } from 'apps/discordbot/src/discord/bot/interface/create-message-with-reaction-response.interface';
import { Observable } from 'rxjs';
import { BotGuildChannel } from './bot-guild-channel.interface';
import { BotGuildMember } from './bot-guild-member.interface';
import { BotGuildRole } from './bot-guild-role.interface';
import { BotLoadGuildCommandsRequest } from './bot-load-guild-commands-request.interface';
import { BotLoadGuildCommandsResponse } from './bot-load-guild-commands-response.interface';
import { BotSpeakRequest } from './bot-speak-request.interface';
import { BotSpeakResponse } from './bot-speak-response.interface';

export interface BotService {
  loadGuildCommands(
    data: BotLoadGuildCommandsRequest,
  ): Observable<BotLoadGuildCommandsResponse>;
  ping(data: { id: number }): Observable<{ id: number }>;
  getGuildChannels(data: { guildId: number }): Observable<BotGuildChannel[]>;
  getGuildMembers(data: { guildId: number }): Observable<BotGuildMember[]>;
  getGuildRoles(data: { guildId: number }): Observable<BotGuildRole[]>;
  speak(data: BotSpeakRequest): Observable<BotSpeakResponse>;
  createMessageWithReactions(
    data: CreateMessageWithReactionRequest,
  ): Observable<CreateMessageWithReactionResponse>;
}
