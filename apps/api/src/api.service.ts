import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateMessageWithReactionRequest } from 'apps/discordbot/src/discord/bot/interface/create-message-with-reaction-request.interface';
import { CreateMessageWithReactionResponse } from 'apps/discordbot/src/discord/bot/interface/create-message-with-reaction-response.interface';
import { Observable } from 'rxjs';
import { BotGuildChannel } from './bot-guild-channel.interface';
import { BotGuildMember } from './bot-guild-member.interface';
import { BotGuildRole } from './bot-guild-role.interface';
import { BotLoadGuildCommandsRequest } from './bot-load-guild-commands-request.interface';
import { BotLoadGuildCommandsResponse } from './bot-load-guild-commands-response.interface';
import { BotService } from './bot-service.interface';
import { BotSpeakRequest } from './bot-speak-request.interface';
import { BotSpeakResponse } from './bot-speak-response.interface';

@Injectable()
export class ApiService implements OnModuleInit {
  private botService: BotService;

  /**
   *
   */
  constructor(@Inject('BOT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.botService = this.client.getService<BotService>('BotService');
  }

  loadGuildCommands(
    data: BotLoadGuildCommandsRequest,
  ): Observable<BotLoadGuildCommandsResponse> {
    return this.botService.loadGuildCommands(data);
  }

  ping(id = 1): Observable<{ id: number }> {
    return this.botService.ping({ id });
  }

  getGuildChannels(guildId: number): Observable<BotGuildChannel[]> {
    return this.botService.getGuildChannels({ guildId });
  }

  getGuildMembers(guildId: number): Observable<BotGuildMember[]> {
    return this.botService.getGuildMembers({ guildId });
  }

  getGuildRoles(guildId: number): Observable<BotGuildRole[]> {
    return this.botService.getGuildRoles({ guildId });
  }

  speak(data: BotSpeakRequest): Observable<BotSpeakResponse> {
    return this.botService.speak(data);
  }

  createMessageWithReaction(
    data: CreateMessageWithReactionRequest,
  ): Observable<CreateMessageWithReactionResponse> {
    return this.botService.createMessageWithReactions(data);
  }
}
