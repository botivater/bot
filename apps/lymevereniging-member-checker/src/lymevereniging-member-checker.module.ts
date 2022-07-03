import { Module } from '@nestjs/common';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Module({
  imports: [],
  controllers: [LymeverenigingMemberCheckerController],
  providers: [LymeverenigingMemberCheckerService],
})
export class LymeverenigingMemberCheckerModule {}
