import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandInvocationService } from './command-invocation.service';
import { CreateCommandInvocationDto } from './dto/create-command-invocation.dto';
import { UpdateCommandInvocationDto } from './dto/update-command-invocation.dto';

@Controller('command-invocation')
export class CommandInvocationController {
  constructor(private readonly commandInvocationService: CommandInvocationService) {}

  @Post()
  create(@Body() createCommandInvocationDto: CreateCommandInvocationDto) {
    return this.commandInvocationService.create(createCommandInvocationDto);
  }

  @Get()
  findAll() {
    return this.commandInvocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandInvocationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommandInvocationDto: UpdateCommandInvocationDto) {
    return this.commandInvocationService.update(+id, updateCommandInvocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandInvocationService.remove(+id);
  }
}
