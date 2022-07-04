import { Test, TestingModule } from '@nestjs/testing';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

describe('LymeverenigingMemberCheckerController', () => {
  let controller: LymeverenigingMemberCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LymeverenigingMemberCheckerController],
      providers: [LymeverenigingMemberCheckerService],
    }).compile();

    controller = module.get<LymeverenigingMemberCheckerController>(LymeverenigingMemberCheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
