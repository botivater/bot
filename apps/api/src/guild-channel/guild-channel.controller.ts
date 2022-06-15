import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GuildChannelService } from './guild-channel.service';
import { CreateGuildChannelDto } from './dto/create-guild-channel.dto';
import { UpdateGuildChannelDto } from './dto/update-guild-channel.dto';

@Controller('guild-channel')
export class GuildChannelController {
  constructor(private readonly guildChannelService: GuildChannelService) {}

  @Post()
  create(@Body() createGuildChannelDto: CreateGuildChannelDto) {
    return this.guildChannelService.create(createGuildChannelDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.guildChannelService.findAll({
      where: {
        guild: {
          id: +guildId,
        },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guildChannelService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuildChannelDto: UpdateGuildChannelDto,
  ) {
    return this.guildChannelService.update(+id, updateGuildChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guildChannelService.remove(+id);
  }
}
