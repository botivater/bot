import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { GuildRoleService } from './guild-role.service';

@UseGuards(JwtGuard)
@Controller('discord/guild-role')
export class GuildRoleController {
  constructor(private readonly guildRoleService: GuildRoleService) {}

  @Get()
  findAll(@Query('guildId') guildId: number) {
    return this.guildRoleService.findAll(guildId);
  }
}
