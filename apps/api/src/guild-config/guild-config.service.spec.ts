import { Test, TestingModule } from '@nestjs/testing';
import { GuildConfigService } from './guild-config.service';

describe('GuildConfigService', () => {
  let service: GuildConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildConfigService],
    }).compile();

    service = module.get<GuildConfigService>(GuildConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
