import { Test, TestingModule } from '@nestjs/testing';
import { LoadGuildCommandsController } from './load-guild-commands.controller';
import { LoadGuildCommandsService } from './load-guild-commands.service';

describe('LoadGuildCommandsController', () => {
  let controller: LoadGuildCommandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadGuildCommandsController],
      providers: [LoadGuildCommandsService],
    }).compile();

    controller = module.get<LoadGuildCommandsController>(LoadGuildCommandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
