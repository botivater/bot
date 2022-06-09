import { Test, TestingModule } from '@nestjs/testing';
import { Discord } from '../../discord';
import { SendMessageBuildingBlockService } from './send-message-building-block.service';

describe('SendMessageBuildingBlockService', () => {
  let service: SendMessageBuildingBlockService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [Discord],
    //   providers: [SendMessageBuildingBlockService],
    // }).compile();
    // service = module.get<SendMessageBuildingBlockService>(
    //   SendMessageBuildingBlockService,
    // );
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
