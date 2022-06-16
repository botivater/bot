import { Test, TestingModule } from '@nestjs/testing';
import { MessageDeleteEventService } from './message-delete-event.service';

describe('MessageDeleteEventService', () => {
  let service: MessageDeleteEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageDeleteEventService],
    }).compile();

    service = module.get<MessageDeleteEventService>(MessageDeleteEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
