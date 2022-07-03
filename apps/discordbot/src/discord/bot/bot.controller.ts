import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BotService, NotFoundError } from './bot/bot.service';
import { CreateMessageWithReactionRequest } from './interface/create-message-with-reaction-request.interface';
import {
  CreateMessageWithReactionResponse,
  CreateMessageWithReactionResponseError,
} from './interface/create-message-with-reaction-response.interface';
import { GetGuildChannelsRequest } from './interface/get-guild-channels-request.interface';
import {
  GetGuildChannelsResponse,
  GetGuildChannelsResponseError,
} from './interface/get-guild-channels-response.interface';
import { GetGuildMembersRequest } from './interface/get-guild-members-request.interface';
import {
  GetGuildMembersResponse,
  GetGuildMembersResponseError,
} from './interface/get-guild-members-response.interface';
import { GetGuildRolesRequest } from './interface/get-guild-roles-request.interface';
import {
  GetGuildRolesResponse,
  GetGuildRolesResponseError,
} from './interface/get-guild-roles-response.interface';
import { LoadAllGuildsCommandsRequest } from './interface/load-all-guilds-commands-request.interface';
import {
  LoadAllGuildsCommandsResponse,
  LoadAllGuildsCommandsResponseError,
} from './interface/load-all-guilds-commands-response.interface';
import { LoadGuildCommandsRequest } from './interface/load-guild-commands-request.interface';
import {
  LoadGuildCommandsResponseError,
  LoadGuildCommandsResponse,
} from './interface/load-guild-commands-response.interface';
import { PingRequest } from './interface/ping-request.interface';
import { PingResponse } from './interface/ping-response.interface';
import { SpeakRequest } from './interface/speak-request.interface';
import {
  SpeakResponse,
  SpeakResponseError,
} from './interface/speak-response.interface';

@Controller('bot')
export class BotController {
  private readonly logger = new Logger(BotController.name);

  /**
   *
   */
  constructor(private readonly botService: BotService) {}

  @MessagePattern({ cmd: 'ping' })
  ping(data: PingRequest): PingResponse {
    this.logger.debug(`MessagePattern->ping()`);
    const { id } = data;

    return {
      id,
    };
  }

  @MessagePattern({ cmd: 'loadAllGuildsCommands' })
  async loadAllGuildsCommands(
    data: LoadAllGuildsCommandsRequest,
  ): Promise<LoadAllGuildsCommandsResponse> {
    try {
      this.logger.debug(`MessagePattern->loadAllGuildsCommands()`);

      await this.botService.loadAllGuildsCommands();

      return {
        success: true,
        error: LoadAllGuildsCommandsResponseError.NONE,
      };
    } catch (err) {
      this.logger.error(err);
      return {
        success: false,
        error: LoadAllGuildsCommandsResponseError.UNKNOWN,
      };
    }
  }

  @MessagePattern({ cmd: 'loadGuildCommands' })
  async loadGuildCommands(
    data: LoadGuildCommandsRequest,
  ): Promise<LoadGuildCommandsResponse> {
    try {
      const { id } = data;

      if (!id) throw new Error('Id is undefined or null');

      this.logger.debug(`MessagePattern->loadGuildCommands(id: ${id})`);

      await this.botService.loadGuildCommands(id);

      return {
        success: true,
        error: LoadGuildCommandsResponseError.NONE,
      };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        return {
          success: false,
          error: LoadGuildCommandsResponseError.NOT_FOUND,
        };
      } else {
        return {
          success: false,
          error: LoadGuildCommandsResponseError.UNKNOWN,
        };
      }
    }
  }

  @MessagePattern({ cmd: 'getGuildChannels' })
  async getGuildChannels(
    data: GetGuildChannelsRequest,
  ): Promise<GetGuildChannelsResponse> {
    try {
      const { guildId } = data;

      if (!guildId) throw new Error('guildId is undefined or null');

      this.logger.debug(
        `MessagePattern->getGuildChannels(guildId: ${guildId})`,
      );

      const guildChannels = await this.botService.getGuildChannels(guildId);

      return {
        success: true,
        error: GetGuildChannelsResponseError.NONE,
        channels: guildChannels,
      };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        return {
          success: false,
          error: GetGuildChannelsResponseError.NOT_FOUND,
          channels: null,
        };
      } else {
        return {
          success: false,
          error: GetGuildChannelsResponseError.UNKNOWN,
          channels: null,
        };
      }
    }
  }

  @MessagePattern({ cmd: 'getGuildMembers' })
  async getGuildMembers(
    data: GetGuildMembersRequest,
  ): Promise<GetGuildMembersResponse> {
    try {
      const { guildId } = data;

      if (!guildId) throw new Error('guildId is undefined or null');

      this.logger.debug(`MessagePattern->getGuildMembers(guildId: ${guildId})`);

      const guildMembers = await this.botService.getGuildMembers(guildId);

      return {
        success: true,
        error: GetGuildMembersResponseError.NONE,
        members: guildMembers,
      };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        return {
          success: false,
          error: GetGuildMembersResponseError.NOT_FOUND,
          members: null,
        };
      } else {
        return {
          success: false,
          error: GetGuildMembersResponseError.UNKNOWN,
          members: null,
        };
      }
    }
  }

  @MessagePattern({ cmd: 'getGuildRoles' })
  async getGuildRoles(
    data: GetGuildRolesRequest,
  ): Promise<GetGuildRolesResponse> {
    try {
      const { guildId } = data;

      if (!guildId) throw new Error('guildId is undefined or null');

      this.logger.debug(`MessagePattern->getGuildRoles(guildId: ${guildId})`);

      const guildRoles = await this.botService.getGuildRoles(guildId);

      return {
        success: true,
        error: GetGuildRolesResponseError.NONE,
        roles: guildRoles,
      };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        return {
          success: false,
          error: GetGuildRolesResponseError.NOT_FOUND,
          roles: null,
        };
      } else {
        return {
          success: false,
          error: GetGuildRolesResponseError.UNKNOWN,
          roles: null,
        };
      }
    }
  }

  @MessagePattern({ cmd: 'speak' })
  async speak(data: SpeakRequest): Promise<SpeakResponse> {
    try {
      const { channelSnowflake, message } = data;

      if (!channelSnowflake)
        throw new Error('channelSnowflake is undefined or null');
      if (!message) throw new Error('message is undefined or null');

      this.logger.debug(
        `MessagePattern->speak(channelSnowflake: ${channelSnowflake}; message: ${message})`,
      );

      await this.botService.speak(channelSnowflake, message);

      return {
        success: true,
        error: SpeakResponseError.NONE,
      };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        return {
          success: false,
          error: SpeakResponseError.NOT_FOUND,
        };
      } else {
        return {
          success: false,
          error: SpeakResponseError.UNKNOWN,
        };
      }
    }
  }

  @MessagePattern({ cmd: 'createMessageWithReactions' })
  async createMessageWithReactions(
    data: CreateMessageWithReactionRequest,
  ): Promise<CreateMessageWithReactionResponse> {
    try {
      const { channelSnowflake, message, reactions } = data;

      if (!channelSnowflake)
        throw new Error('channelSnowflake is undefined or null');
      if (!message) throw new Error('message is undefined or null');
      if (!reactions) throw new Error('reactions is undefined or null');

      this.logger.debug(
        `MessagePattern->createMessageWithReaction(channelSnowflake: ${channelSnowflake}; message: ${message}; reactions: ${reactions})`,
      );

      const messageSnowflake = await this.botService.createMessageWithReactions(
        channelSnowflake,
        message,
        reactions,
      );

      return {
        success: true,
        error: CreateMessageWithReactionResponseError.NONE,
        messageSnowflake,
      };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        return {
          success: false,
          error: CreateMessageWithReactionResponseError.NOT_FOUND,
          messageSnowflake: null,
        };
      } else {
        return {
          success: false,
          error: CreateMessageWithReactionResponseError.UNKNOWN,
          messageSnowflake: null,
        };
      }
    }
  }
}
