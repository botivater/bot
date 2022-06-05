import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionEventService } from './message-reaction-event.service';

describe('MessageReactionEventService', () => {
  let service: MessageReactionEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageReactionEventService],
    }).compile();

    service = module.get<MessageReactionEventService>(
      MessageReactionEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
