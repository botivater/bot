import { Test, TestingModule } from '@nestjs/testing';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

describe('LymeverenigingMemberCheckerService', () => {
  let service: LymeverenigingMemberCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LymeverenigingMemberCheckerService],
    }).compile();

    service = module.get<LymeverenigingMemberCheckerService>(LymeverenigingMemberCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
