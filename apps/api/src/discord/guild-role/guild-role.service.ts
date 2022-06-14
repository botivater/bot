import { Injectable, Logger } from '@nestjs/common';
import { ApiService } from '../../api.service';

@Injectable()
export class GuildRoleService {
  private readonly logger = new Logger(GuildRoleService.name);

  /**
   *
   */
  constructor(private readonly apiService: ApiService) {}

  findAll(guildId: number) {
    return this.apiService.getGuildRoles(guildId);
  }
}
