import { Test, TestingModule } from '@nestjs/testing';
import { Contrib/lymeverenigingMemberCheckerController } from './contrib/lymevereniging-member-checker.controller';
import { Contrib/lymeverenigingMemberCheckerService } from './contrib/lymevereniging-member-checker.service';

describe('Contrib/lymeverenigingMemberCheckerController', () => {
  let contrib/lymeverenigingMemberCheckerController: Contrib/lymeverenigingMemberCheckerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Contrib/lymeverenigingMemberCheckerController],
      providers: [Contrib/lymeverenigingMemberCheckerService],
    }).compile();

    contrib/lymeverenigingMemberCheckerController = app.get<Contrib/lymeverenigingMemberCheckerController>(Contrib/lymeverenigingMemberCheckerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(contrib/lymeverenigingMemberCheckerController.getHello()).toBe('Hello World!');
    });
  });
});
