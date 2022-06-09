import { Test, TestingModule } from '@nestjs/testing';
import { LogUsageService } from './log-usage.service';

describe('LogUsageService', () => {
  let service: LogUsageService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [LogUsageService],
    // }).compile();
    // service = module.get<LogUsageService>(LogUsageService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
