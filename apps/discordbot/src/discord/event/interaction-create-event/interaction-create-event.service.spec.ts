import { Test, TestingModule } from '@nestjs/testing';
import { InteractionCreateEventService } from './interaction-create-event.service';

describe('InteractionCreateEventService', () => {
  let service: InteractionCreateEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionCreateEventService],
    }).compile();

    service = module.get<InteractionCreateEventService>(
      InteractionCreateEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
