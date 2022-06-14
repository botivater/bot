import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BotService, NotFoundError } from './bot/bot.service';
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

  @GrpcMethod('BotService')
  ping(data: PingRequest): PingResponse {
    this.logger.debug(`GRPC->ping()`);
    const { id } = data;

    return {
      id,
    };
  }

  @GrpcMethod('BotService')
  async loadAllGuildsCommands(
    data: LoadAllGuildsCommandsRequest,
  ): Promise<LoadAllGuildsCommandsResponse> {
    try {
      this.logger.debug(`GRPC->loadAllGuildsCommands()`);

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

  @GrpcMethod('BotService')
  async loadGuildCommands(
    data: LoadGuildCommandsRequest,
  ): Promise<LoadGuildCommandsResponse> {
    try {
      const { id } = data;

      if (!id) throw new Error('Id is undefined or null');

      this.logger.debug(`GRPC->loadGuildCommands(id: ${id})`);

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

  @GrpcMethod('BotService')
  async getGuildChannels(
    data: GetGuildChannelsRequest,
  ): Promise<GetGuildChannelsResponse> {
    try {
      const { guildId } = data;

      if (!guildId) throw new Error('guildId is undefined or null');

      this.logger.debug(`GRPC->getGuildChannels(guildId: ${guildId})`);

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

  @GrpcMethod('BotService')
  async getGuildMembers(
    data: GetGuildMembersRequest,
  ): Promise<GetGuildMembersResponse> {
    try {
      const { guildId } = data;

      if (!guildId) throw new Error('guildId is undefined or null');

      this.logger.debug(`GRPC->getGuildMembers(guildId: ${guildId})`);

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

  @GrpcMethod('BotService')
  async getGuildRoles(
    data: GetGuildRolesRequest,
  ): Promise<GetGuildRolesResponse> {
    try {
      const { guildId } = data;

      if (!guildId) throw new Error('guildId is undefined or null');

      this.logger.debug(`GRPC->getGuildRoles(guildId: ${guildId})`);

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

  @GrpcMethod('BotService')
  async speak(data: SpeakRequest): Promise<SpeakResponse> {
    try {
      const { channelSnowflake, message } = data;

      if (!channelSnowflake)
        throw new Error('channelSnowflake is undefined or null');
      if (!message) throw new Error('message is undefined or null');

      this.logger.debug(
        `GRPC->speak(channelSnowflake: ${channelSnowflake}; message: ${message})`,
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
}
