import { Test, TestingModule } from '@nestjs/testing';
import { ChannelUpdateEventService } from './channel-update-event.service';

describe('ChannelUpdateEventService', () => {
  let service: ChannelUpdateEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelUpdateEventService],
    }).compile();

    service = module.get<ChannelUpdateEventService>(ChannelUpdateEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
