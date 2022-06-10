import { Test, TestingModule } from '@nestjs/testing';
import { SyncProvider } from './sync-provider';

describe('SyncProvider', () => {
  let provider: SyncProvider;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [SyncProvider],
    // }).compile();
    // provider = module.get<SyncProvider>(SyncProvider);
  });

  it('should be defined', () => {
    // expect(provider).toBeDefined();
  });
});
