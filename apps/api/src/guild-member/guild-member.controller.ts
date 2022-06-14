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
import { GuildMemberService } from './guild-member.service';
import { CreateGuildMemberDto } from './dto/create-guild-member.dto';
import { UpdateGuildMemberDto } from './dto/update-guild-member.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('guild-member')
export class GuildMemberController {
  constructor(private readonly guildMemberService: GuildMemberService) {}

  @Post()
  create(@Body() createGuildMemberDto: CreateGuildMemberDto) {
    return this.guildMemberService.create(createGuildMemberDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.guildMemberService.findAll({
      where: {
        guild: {
          id: +guildId,
        },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guildMemberService.findOne({
      where: {
        id: +id,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuildMemberDto: UpdateGuildMemberDto,
  ) {
    return this.guildMemberService.update(+id, updateGuildMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guildMemberService.remove(+id);
  }
}
