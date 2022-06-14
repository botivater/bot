import { Test, TestingModule } from '@nestjs/testing';
import { GuildMemberController } from './guild-member.controller';
import { GuildMemberService } from './guild-member.service';

describe('GuildMemberController', () => {
  let controller: GuildMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildMemberController],
      providers: [GuildMemberService],
    }).compile();

    controller = module.get<GuildMemberController>(GuildMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
