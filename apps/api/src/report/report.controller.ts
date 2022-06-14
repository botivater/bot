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
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Get()
  findAll(@Query('guildId') guildId: string) {
    return this.reportService.findAll({
      where: {
        guild: { id: +guildId },
      },
      relations: {
        guildMember: true,
        reportedGuildMember: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne({
      where: { id: +id },
      relations: {
        guildMember: true,
        reportedGuildMember: true,
      },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
