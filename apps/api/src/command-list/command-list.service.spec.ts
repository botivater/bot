import { Test, TestingModule } from '@nestjs/testing';
import { CommandListService } from './command-list.service';

describe('CommandListService', () => {
  let service: CommandListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandListService],
    }).compile();

    service = module.get<CommandListService>(CommandListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
