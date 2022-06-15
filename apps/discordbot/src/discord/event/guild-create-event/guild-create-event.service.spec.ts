import { Test, TestingModule } from '@nestjs/testing';
import { GuildCreateEventService } from './guild-create-event.service';

describe('GuildCreateEventService', () => {
  let service: GuildCreateEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildCreateEventService],
    }).compile();

    service = module.get<GuildCreateEventService>(GuildCreateEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
