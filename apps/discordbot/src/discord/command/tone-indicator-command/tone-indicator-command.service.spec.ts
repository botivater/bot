import { Test, TestingModule } from '@nestjs/testing';
import { ToneIndicatorCommandService } from './tone-indicator-command.service';

describe('ToneIndicatorCommandService', () => {
  let service: ToneIndicatorCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToneIndicatorCommandService],
    }).compile();

    service = module.get<ToneIndicatorCommandService>(ToneIndicatorCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
