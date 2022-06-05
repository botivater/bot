import { Test, TestingModule } from '@nestjs/testing';
import { VoiceStateUpdateEventService } from './voice-state-update-event.service';

describe('VoiceStateUpdateEventService', () => {
  let service: VoiceStateUpdateEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceStateUpdateEventService],
    }).compile();

    service = module.get<VoiceStateUpdateEventService>(
      VoiceStateUpdateEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
