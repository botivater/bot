import { Test, TestingModule } from '@nestjs/testing';
import { GuildChannelController } from './guild-channel.controller';
import { GuildChannelService } from './guild-channel.service';

describe('GuildChannelController', () => {
  let controller: GuildChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildChannelController],
      providers: [GuildChannelService],
    }).compile();

    controller = module.get<GuildChannelController>(GuildChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
