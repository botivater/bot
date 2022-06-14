import { Test, TestingModule } from '@nestjs/testing';
import { LoadGuildCommandsService } from './load-guild-commands.service';

describe('LoadGuildCommandsService', () => {
  let service: LoadGuildCommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadGuildCommandsService],
    }).compile();

    service = module.get<LoadGuildCommandsService>(LoadGuildCommandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
