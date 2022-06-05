import { Test, TestingModule } from '@nestjs/testing';
import { RecreateFlowsCommandService } from './recreate-flows-command.service';

describe('RecreateFlowsCommandService', () => {
  let service: RecreateFlowsCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecreateFlowsCommandService],
    }).compile();

    service = module.get<RecreateFlowsCommandService>(RecreateFlowsCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
