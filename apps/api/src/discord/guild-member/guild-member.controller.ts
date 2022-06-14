import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { GuildMemberService } from './guild-member.service';

@UseGuards(JwtGuard)
@Controller('discord/guild-member')
export class GuildMemberController {
  constructor(private readonly guildMemberService: GuildMemberService) {}

  @Get()
  findAll(@Query('guildId') guildId: number) {
    return this.guildMemberService.findAll(guildId);
  }
}
