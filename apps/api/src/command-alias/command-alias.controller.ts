import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CommandAliasService } from './command-alias.service';
import { CreateCommandAliasDto } from './dto/create-command-alias.dto';
import { UpdateCommandAliasDto } from './dto/update-command-alias.dto';

@UseGuards(JwtGuard)
@Controller('command-alias')
export class CommandAliasController {
  constructor(private readonly commandAliasService: CommandAliasService) {}

  @Post()
  create(@Body() createCommandAliasDto: CreateCommandAliasDto) {
    return this.commandAliasService.create(createCommandAliasDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.commandAliasService.findAll({
      where: { guild: { id: +guildId } },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandAliasService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandAliasDto: UpdateCommandAliasDto,
  ) {
    return this.commandAliasService.update(+id, updateCommandAliasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandAliasService.remove(+id);
  }
}
