import { Test, TestingModule } from '@nestjs/testing';
import { MessageDeleteBulkEventService } from './message-delete-bulk-event.service';

describe('MessageDeleteBulkEventService', () => {
  let service: MessageDeleteBulkEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageDeleteBulkEventService],
    }).compile();

    service = module.get<MessageDeleteBulkEventService>(
      MessageDeleteBulkEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
