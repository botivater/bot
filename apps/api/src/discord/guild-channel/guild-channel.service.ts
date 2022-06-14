import { Injectable, Logger } from '@nestjs/common';
import { ApiService } from '../../api.service';

@Injectable()
export class GuildChannelService {
  private readonly logger = new Logger(GuildChannelService.name);

  /**
   *
   */
  constructor(private readonly apiService: ApiService) {}

  findAll(guildId: number) {
    return this.apiService.getGuildChannels(guildId);
  }
}
