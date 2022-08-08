import { Test, TestingModule } from '@nestjs/testing';
import { AskAnonymouslyCommandService } from './ask-anonymously-command.service';

describe('AskAnonymouslyCommandService', () => {
  let service: AskAnonymouslyCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AskAnonymouslyCommandService],
    }).compile();

    service = module.get<AskAnonymouslyCommandService>(
      AskAnonymouslyCommandService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
