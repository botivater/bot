import { Test, TestingModule } from '@nestjs/testing';
import { ChannelDeleteEventService } from './channel-delete-event.service';

describe('ChannelDeleteEventService', () => {
  let service: ChannelDeleteEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelDeleteEventService],
    }).compile();

    service = module.get<ChannelDeleteEventService>(ChannelDeleteEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
