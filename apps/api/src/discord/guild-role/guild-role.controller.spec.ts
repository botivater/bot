import { Test, TestingModule } from '@nestjs/testing';
import { GuildRoleController } from './guild-role.controller';
import { GuildRoleService } from './guild-role.service';

describe('GuildRoleController', () => {
  let controller: GuildRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildRoleController],
      providers: [GuildRoleService],
    }).compile();

    controller = module.get<GuildRoleController>(GuildRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
