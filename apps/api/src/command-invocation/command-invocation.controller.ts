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
import { CommandInvocationService } from './command-invocation.service';
import { CreateCommandInvocationDto } from './dto/create-command-invocation.dto';
import { UpdateCommandInvocationDto } from './dto/update-command-invocation.dto';

@UseGuards(JwtGuard)
@Controller('command-invocation')
export class CommandInvocationController {
  constructor(
    private readonly commandInvocationService: CommandInvocationService,
  ) {}

  @Post()
  create(@Body() createCommandInvocationDto: CreateCommandInvocationDto) {
    return this.commandInvocationService.create(createCommandInvocationDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.commandInvocationService.findAll({
      where: {
        guild: { id: +guildId },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandInvocationService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandInvocationDto: UpdateCommandInvocationDto,
  ) {
    return this.commandInvocationService.update(
      +id,
      updateCommandInvocationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandInvocationService.remove(+id);
  }
}
