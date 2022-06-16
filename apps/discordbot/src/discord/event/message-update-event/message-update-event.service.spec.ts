import { Test, TestingModule } from '@nestjs/testing';
import { MessageUpdateEventService } from './message-update-event.service';

describe('MessageUpdateEventService', () => {
  let service: MessageUpdateEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageUpdateEventService],
    }).compile();

    service = module.get<MessageUpdateEventService>(MessageUpdateEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
