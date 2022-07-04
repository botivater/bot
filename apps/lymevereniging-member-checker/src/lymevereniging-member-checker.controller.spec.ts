import { Test, TestingModule } from '@nestjs/testing';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

describe('LymeverenigingMemberCheckerController', () => {
  let lymeverenigingMemberCheckerController: LymeverenigingMemberCheckerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LymeverenigingMemberCheckerController],
      providers: [LymeverenigingMemberCheckerService],
    }).compile();

    lymeverenigingMemberCheckerController =
      app.get<LymeverenigingMemberCheckerController>(
        LymeverenigingMemberCheckerController,
      );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(lymeverenigingMemberCheckerController.getHello()).toBe(
        'Hello World!',
      );
    });
  });
});
