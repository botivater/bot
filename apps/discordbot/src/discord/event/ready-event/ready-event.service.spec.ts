import { Test, TestingModule } from '@nestjs/testing';
import { ReadyEventService } from './ready-event.service';

describe('ReadyEventService', () => {
  let service: ReadyEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadyEventService],
    }).compile();

    service = module.get<ReadyEventService>(ReadyEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
