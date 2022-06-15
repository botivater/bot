import { Test, TestingModule } from '@nestjs/testing';
import { GenerateLoginService } from './generate-login.service';

describe('GenerateLoginService', () => {
  let service: GenerateLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateLoginService],
    }).compile();

    service = module.get<GenerateLoginService>(GenerateLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
