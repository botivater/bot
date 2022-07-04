import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';
import { CreateLymeverenigingMemberCheckerDto } from './dto/create-lymevereniging-member-checker.dto';
import { UpdateLymeverenigingMemberCheckerDto } from './dto/update-lymevereniging-member-checker.dto';

@Controller('module/lymevereniging-member-checker')
export class LymeverenigingMemberCheckerController {
  constructor(
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {}

  @Post()
  create(
    @Body()
    createLymeverenigingMemberCheckerDto: CreateLymeverenigingMemberCheckerDto,
  ) {
    return this.lymeverenigingMemberCheckerService.create(
      createLymeverenigingMemberCheckerDto,
    );
  }

  @Get()
  findAll() {
    return this.lymeverenigingMemberCheckerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lymeverenigingMemberCheckerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateLymeverenigingMemberCheckerDto: UpdateLymeverenigingMemberCheckerDto,
  ) {
    return this.lymeverenigingMemberCheckerService.update(
      +id,
      updateLymeverenigingMemberCheckerDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lymeverenigingMemberCheckerService.remove(+id);
  }
}
