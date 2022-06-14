import { Test, TestingModule } from '@nestjs/testing';
import { CommandFlowGroupService } from './command-flow-group.service';

describe('CommandFlowGroupService', () => {
  let service: CommandFlowGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandFlowGroupService],
    }).compile();

    service = module.get<CommandFlowGroupService>(CommandFlowGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
