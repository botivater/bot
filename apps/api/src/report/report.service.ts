import { Report } from '@common/common/report/report.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable({ scope: Scope.REQUEST })
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const report = this.reportRepository.create(createReportDto);
    return await this.reportRepository.save(report);
  }

  async findAll(options?: FindManyOptions<Report>) {
    return await this.reportRepository.find(options);
  }

  async findOne(options: FindOneOptions<Report>) {
    return await this.reportRepository.findOne(options);
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.findOneBy({ id });
    this.reportRepository.merge(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  async remove(id: number) {
    return await this.reportRepository.delete({ id });
  }
}
