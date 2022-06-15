import { Test, TestingModule } from '@nestjs/testing';
import { ChannelCreateEventService } from './channel-create-event.service';

describe('ChannelCreateEventService', () => {
  let service: ChannelCreateEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelCreateEventService],
    }).compile();

    service = module.get<ChannelCreateEventService>(ChannelCreateEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
