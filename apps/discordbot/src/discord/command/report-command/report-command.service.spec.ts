import { Test, TestingModule } from '@nestjs/testing';
import { ReportCommandService } from './report-command.service';

describe('ReportCommandService', () => {
  let service: ReportCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportCommandService],
    }).compile();

    service = module.get<ReportCommandService>(ReportCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
