import { Injectable, Logger } from '@nestjs/common';
import { ApiService } from '../../api.service';

@Injectable()
export class GuildMemberService {
  private readonly logger = new Logger(GuildMemberService.name);

  /**
   *
   */
  constructor(private readonly apiService: ApiService) {}

  findAll(guildId: number) {
    return this.apiService.getGuildMembers(guildId);
  }
}
