import { Test, TestingModule } from '@nestjs/testing';
import { MessageCreateEventService } from './message-create-event.service';

describe('MessageCreateService', () => {
  let service: MessageCreateEventService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [MessageCreateEventService],
    // }).compile();
    // service = module.get<MessageCreateEventService>(MessageCreateEventService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
