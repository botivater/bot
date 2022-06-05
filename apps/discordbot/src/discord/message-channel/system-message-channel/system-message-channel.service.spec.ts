import { Test, TestingModule } from '@nestjs/testing';
import { SystemMessageChannelService } from './system-message-channel.service';

describe('SystemMessageChannelService', () => {
  let service: SystemMessageChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemMessageChannelService],
    }).compile();

    service = module.get<SystemMessageChannelService>(
      SystemMessageChannelService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
