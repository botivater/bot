import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GuildConfigService } from './guild-config.service';
import { CreateGuildConfigDto } from './dto/create-guild-config.dto';
import { UpdateGuildConfigDto } from './dto/update-guild-config.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('guild-config')
export class GuildConfigController {
  constructor(private readonly guildConfigService: GuildConfigService) {}

  @Post()
  create(@Body() createGuildConfigDto: CreateGuildConfigDto) {
    return this.guildConfigService.create(createGuildConfigDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.guildConfigService.findAll({
      where: { guild: { id: +guildId } },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guildConfigService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuildConfigDto: UpdateGuildConfigDto,
  ) {
    return this.guildConfigService.update(+id, updateGuildConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guildConfigService.remove(+id);
  }
}
