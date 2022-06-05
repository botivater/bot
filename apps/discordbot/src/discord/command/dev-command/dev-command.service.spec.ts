import { Test, TestingModule } from '@nestjs/testing';
import { DevCommandService } from './dev-command.service';

describe('DevCommandService', () => {
  let service: DevCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevCommandService],
    }).compile();

    service = module.get<DevCommandService>(DevCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
