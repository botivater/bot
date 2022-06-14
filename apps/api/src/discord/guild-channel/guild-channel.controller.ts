import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { GuildChannelService } from './guild-channel.service';

@UseGuards(JwtGuard)
@Controller('discord/guild-channel')
export class GuildChannelController {
  constructor(private readonly guildChannelService: GuildChannelService) {}

  @Get()
  findAll(@Query('guildId') guildId: number) {
    return this.guildChannelService.findAll(guildId);
  }
}
