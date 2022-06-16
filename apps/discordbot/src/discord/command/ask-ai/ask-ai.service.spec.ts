import { Test, TestingModule } from '@nestjs/testing';
import { AskAiService } from './ask-ai.service';

describe('AskAiService', () => {
  let service: AskAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AskAiService],
    }).compile();

    service = module.get<AskAiService>(AskAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
