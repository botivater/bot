import { Test, TestingModule } from '@nestjs/testing';
import { ChatAiReplyService } from './chat-ai-reply.service';

describe('ChatAiReplyService', () => {
  let service: ChatAiReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatAiReplyService],
    }).compile();

    service = module.get<ChatAiReplyService>(ChatAiReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
