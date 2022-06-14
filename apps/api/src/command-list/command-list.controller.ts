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
import { JwtGuard } from '../auth/jwt.guard';
import { CommandListService } from './command-list.service';
import { CreateCommandListDto } from './dto/create-command-list.dto';
import { UpdateCommandListDto } from './dto/update-command-list.dto';

@UseGuards(JwtGuard)
@Controller('command-list')
export class CommandListController {
  constructor(private readonly commandListService: CommandListService) {}

  @Post()
  create(@Body() createCommandListDto: CreateCommandListDto) {
    return this.commandListService.create(createCommandListDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.commandListService.findAll({
      where: { guild: { id: +guildId } },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandListService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandListDto: UpdateCommandListDto,
  ) {
    return this.commandListService.update(+id, updateCommandListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandListService.remove(+id);
  }
}
