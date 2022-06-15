import { Test, TestingModule } from '@nestjs/testing';
import { CoupleLoginService } from './couple-login.service';

describe('CoupleLoginService', () => {
  let service: CoupleLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoupleLoginService],
    }).compile();

    service = module.get<CoupleLoginService>(CoupleLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
