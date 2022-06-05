import { Test, TestingModule } from '@nestjs/testing';
import { SetBirthdayCommandService } from './set-birthday-command.service';

describe('SetBirthdayCommandService', () => {
  let service: SetBirthdayCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetBirthdayCommandService],
    }).compile();

    service = module.get<SetBirthdayCommandService>(SetBirthdayCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
