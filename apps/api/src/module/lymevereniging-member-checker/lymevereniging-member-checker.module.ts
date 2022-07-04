import { Module } from '@nestjs/common';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';

@Module({
  controllers: [LymeverenigingMemberCheckerController],
  providers: [LymeverenigingMemberCheckerService]
})
export class LymeverenigingMemberCheckerModule {}
