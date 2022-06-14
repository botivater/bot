import { Test, TestingModule } from '@nestjs/testing';
import { GuildRoleService } from './guild-role.service';

describe('GuildRoleService', () => {
  let service: GuildRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildRoleService],
    }).compile();

    service = module.get<GuildRoleService>(GuildRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
