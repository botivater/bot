import { Test, TestingModule } from '@nestjs/testing';
import { GuildMemberRemoveEventService } from './guild-member-remove-event.service';

describe('GuildMemberRemoveEventService', () => {
  let service: GuildMemberRemoveEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildMemberRemoveEventService],
    }).compile();

    service = module.get<GuildMemberRemoveEventService>(GuildMemberRemoveEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
