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
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { FindOptionsWhere } from 'typeorm';
import { Message } from '@common/common/message/message.entity';

@UseGuards(JwtGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll(
    @Query('guildChannelId') guildChannelId: string,
    @Query('guildMemberId') guildMemberId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const where: FindOptionsWhere<Message> = {};

    if (+guildChannelId) {
      where.guildChannel = {
        id: +guildChannelId,
      };
    }

    if (+guildMemberId) {
      where.guildMember = {
        id: +guildMemberId,
      };
    }

    return this.messageService.findAll({
      where,
      order: {
        createdAt: 'ASC',
      },
      relations: {
        guildMember: true,
        guildChannel: true,
      },
      take: limit,
      skip: offset,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
