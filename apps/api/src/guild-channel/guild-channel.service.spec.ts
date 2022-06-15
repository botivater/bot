import { Test, TestingModule } from '@nestjs/testing';
import { GuildChannelService } from './guild-channel.service';

describe('GuildChannelService', () => {
  let service: GuildChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildChannelService],
    }).compile();

    service = module.get<GuildChannelService>(GuildChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
