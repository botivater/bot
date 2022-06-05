import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Discord } from './discord';

describe('Discord', () => {
  let provider: Discord;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [Discord],
    }).compile();

    provider = module.get<Discord>(Discord);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
