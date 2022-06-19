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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Guild config')
@UseGuards(JwtGuard)
@Controller('guild-config')
export class GuildConfigController {
  constructor(private readonly guildConfigService: GuildConfigService) {}

  @ApiOperation({ summary: 'Create a guild config' })
  @Post()
  create(@Body() createGuildConfigDto: CreateGuildConfigDto) {
    return this.guildConfigService.create(createGuildConfigDto);
  }

  @ApiOperation({ summary: 'Find all guild configs' })
  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.guildConfigService.findAll({
      where: { guild: { id: +guildId } },
    });
  }

  @ApiOperation({ summary: 'Find a guild config' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guildConfigService.findOne({ where: { id: +id } });
  }

  @ApiOperation({ summary: 'Update a guild config' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuildConfigDto: UpdateGuildConfigDto,
  ) {
    return this.guildConfigService.update(+id, updateGuildConfigDto);
  }

  @ApiOperation({ summary: 'Delete a guild config' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guildConfigService.remove(+id);
  }
}
