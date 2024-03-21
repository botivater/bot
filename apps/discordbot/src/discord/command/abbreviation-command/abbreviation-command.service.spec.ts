import { Test, TestingModule } from '@nestjs/testing';
import { AbbreviationCommandService } from './abbreviation-command.service';

describe('AbbreviationCommandService', () => {
  let service: AbbreviationCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbbreviationCommandService],
    }).compile();

    service = module.get<AbbreviationCommandService>(
      AbbreviationCommandService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
