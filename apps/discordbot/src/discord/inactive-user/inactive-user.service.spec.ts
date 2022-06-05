import { Test, TestingModule } from '@nestjs/testing';
import { InactiveUserService } from './inactive-user.service';

describe('InactiveUserService', () => {
  let service: InactiveUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InactiveUserService],
    }).compile();

    service = module.get<InactiveUserService>(InactiveUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
