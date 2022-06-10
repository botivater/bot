import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BotService, NotFoundError } from './bot/bot.service';
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

@Controller('bot')
export class BotController {
  private readonly logger = new Logger(BotController.name);

  /**
   *
   */
  constructor(private readonly botService: BotService) {}

  @GrpcMethod('BotService')
  ping(
    data: PingRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): PingResponse {
    this.logger.debug(`GRPC->ping()`);
    const { id } = data;

    return {
      id,
    };
  }

  @GrpcMethod('BotService')
  async loadAllGuildsCommands(
    data: LoadAllGuildsCommandsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
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
        error: LoadAllGuildsCommandsResponseError.UNKOWN,
      };
    }
  }

  @GrpcMethod('BotService')
  async loadGuildCommands(
    data: LoadGuildCommandsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
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
          error: LoadGuildCommandsResponseError.UNKOWN,
        };
      }
    }
  }
}
