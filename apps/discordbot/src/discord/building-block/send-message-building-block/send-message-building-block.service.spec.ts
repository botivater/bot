import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageBuildingBlockService } from './send-message-building-block.service';

describe('SendMessageBuildingBlockService', () => {
  let service: SendMessageBuildingBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageBuildingBlockService],
    }).compile();

    service = module.get<SendMessageBuildingBlockService>(SendMessageBuildingBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
