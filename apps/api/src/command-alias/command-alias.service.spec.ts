import { Test, TestingModule } from '@nestjs/testing';
import { CommandAliasService } from './command-alias.service';

describe('CommandAliasService', () => {
  let service: CommandAliasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandAliasService],
    }).compile();

    service = module.get<CommandAliasService>(CommandAliasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
