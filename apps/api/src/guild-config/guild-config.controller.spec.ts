import { Test, TestingModule } from '@nestjs/testing';
import { GuildConfigController } from './guild-config.controller';
import { GuildConfigService } from './guild-config.service';

describe('GuildConfigController', () => {
  let controller: GuildConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildConfigController],
      providers: [GuildConfigService],
    }).compile();

    controller = module.get<GuildConfigController>(GuildConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
