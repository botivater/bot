import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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

@Injectable()
export class ApiService {
  /**
   *
   */
  constructor(
    @Inject('DISCORDBOT_SERVICE') private discordBotServiceClient: ClientProxy,
  ) {}

  ping(id = 1): Observable<{ id: number }> {
    return this.discordBotServiceClient.send({ cmd: 'ping' }, { id });
  }

  loadGuildCommands(
    data: BotLoadGuildCommandsRequest,
  ): Observable<BotLoadGuildCommandsResponse> {
    return this.discordBotServiceClient.send(
      { cmd: 'loadGuildCommands' },
      data,
    );
  }

  getGuildChannels(guildId: number): Observable<BotGuildChannel[]> {
    return this.discordBotServiceClient.send(
      { cmd: 'getGuildChannels' },
      { guildId },
    );
  }

  getGuildMembers(guildId: number): Observable<BotGuildMember[]> {
    return this.discordBotServiceClient.send(
      { cmd: 'getGuildMembers' },
      { guildId },
    );
  }

  getGuildRoles(guildId: number): Observable<BotGuildRole[]> {
    return this.discordBotServiceClient.send(
      { cmd: 'getGuildRoles' },
      { guildId },
    );
  }

  speak(data: BotSpeakRequest): Observable<BotSpeakResponse> {
    return this.discordBotServiceClient.send({ cmd: 'speak' }, data);
  }

  createMessageWithReaction(
    data: CreateMessageWithReactionRequest,
  ): Observable<CreateMessageWithReactionResponse> {
    return this.discordBotServiceClient.send(
      { cmd: 'createMessageWithReactions' },
      data,
    );
  }
}
