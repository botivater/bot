import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionRemoveEventService } from './message-reaction-remove-event.service';

describe('MessageReactionRemoveEventService', () => {
  let service: MessageReactionRemoveEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageReactionRemoveEventService],
    }).compile();

    service = module.get<MessageReactionRemoveEventService>(MessageReactionRemoveEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
