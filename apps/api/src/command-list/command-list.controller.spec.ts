import { Test, TestingModule } from '@nestjs/testing';
import { CommandListController } from './command-list.controller';
import { CommandListService } from './command-list.service';

describe('CommandListController', () => {
  let controller: CommandListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandListController],
      providers: [CommandListService],
    }).compile();

    controller = module.get<CommandListController>(CommandListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
