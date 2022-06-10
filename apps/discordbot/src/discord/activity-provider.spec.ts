import { Test, TestingModule } from '@nestjs/testing';
import { ActivityProvider } from './activity-provider';

describe('Activity', () => {
  let provider: ActivityProvider;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [ActivityProvider],
    // }).compile();
    // provider = module.get<ActivityProvider>(ActivityProvider);
  });

  it('should be defined', () => {
    // expect(provider).toBeDefined();
  });
});
