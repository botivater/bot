import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { LoadGuildCommandsDto } from './dto/load-guild-commands.dto';
import { LoadGuildCommandsService } from './load-guild-commands.service';

@UseGuards(JwtGuard)
@Controller('discord/load-guild-commands')
export class LoadGuildCommandsController {
  constructor(
    private readonly loadGuildCommandsService: LoadGuildCommandsService,
  ) {}

  @Post()
  loadGuildCommands(@Body() loadGuildCommandsDto: LoadGuildCommandsDto) {
    return this.loadGuildCommandsService.loadGuildCommands(
      loadGuildCommandsDto,
    );
  }
}
