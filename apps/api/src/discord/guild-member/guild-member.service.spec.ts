import { Test, TestingModule } from '@nestjs/testing';
import { GuildMemberService } from './guild-member.service';

describe('GuildMemberService', () => {
  let service: GuildMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildMemberService],
    }).compile();

    service = module.get<GuildMemberService>(GuildMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
