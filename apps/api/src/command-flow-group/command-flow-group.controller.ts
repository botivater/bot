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
import { CommandFlowGroupService } from './command-flow-group.service';
import { CreateCommandFlowGroupDto } from './dto/create-command-flow-group.dto';
import { UpdateCommandFlowGroupDto } from './dto/update-command-flow-group.dto';

@UseGuards(JwtGuard)
@Controller('command-flow-group')
export class CommandFlowGroupController {
  constructor(
    private readonly commandFlowGroupService: CommandFlowGroupService,
  ) {}

  @Post()
  create(@Body() createCommandFlowGroupDto: CreateCommandFlowGroupDto) {
    return this.commandFlowGroupService.create(createCommandFlowGroupDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.commandFlowGroupService.findAll({
      where: { guild: { id: +guildId } },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandFlowGroupService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandFlowGroupDto: UpdateCommandFlowGroupDto,
  ) {
    return this.commandFlowGroupService.update(+id, updateCommandFlowGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandFlowGroupService.remove(+id);
  }
}
