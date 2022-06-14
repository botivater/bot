import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandFlowGroupService } from './command-flow-group.service';
import { CreateCommandFlowGroupDto } from './dto/create-command-flow-group.dto';
import { UpdateCommandFlowGroupDto } from './dto/update-command-flow-group.dto';

@Controller('command-flow-group')
export class CommandFlowGroupController {
  constructor(private readonly commandFlowGroupService: CommandFlowGroupService) {}

  @Post()
  create(@Body() createCommandFlowGroupDto: CreateCommandFlowGroupDto) {
    return this.commandFlowGroupService.create(createCommandFlowGroupDto);
  }

  @Get()
  findAll() {
    return this.commandFlowGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandFlowGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommandFlowGroupDto: UpdateCommandFlowGroupDto) {
    return this.commandFlowGroupService.update(+id, updateCommandFlowGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandFlowGroupService.remove(+id);
  }
}
