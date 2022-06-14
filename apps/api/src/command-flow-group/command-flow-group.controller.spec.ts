import { Test, TestingModule } from '@nestjs/testing';
import { CommandFlowGroupController } from './command-flow-group.controller';
import { CommandFlowGroupService } from './command-flow-group.service';

describe('CommandFlowGroupController', () => {
  let controller: CommandFlowGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandFlowGroupController],
      providers: [CommandFlowGroupService],
    }).compile();

    controller = module.get<CommandFlowGroupController>(CommandFlowGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
