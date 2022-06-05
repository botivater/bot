import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionAddEventService } from './message-reaction-add-event.service';

describe('MessageReactionAddEventService', () => {
  let service: MessageReactionAddEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageReactionAddEventService],
    }).compile();

    service = module.get<MessageReactionAddEventService>(
      MessageReactionAddEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
