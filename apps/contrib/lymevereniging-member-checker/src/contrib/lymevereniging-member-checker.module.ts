import { Module } from '@nestjs/common';
import { Contrib/lymeverenigingMemberCheckerController } from './contrib/lymevereniging-member-checker.controller';
import { Contrib/lymeverenigingMemberCheckerService } from './contrib/lymevereniging-member-checker.service';

@Module({
  imports: [],
  controllers: [Contrib/lymeverenigingMemberCheckerController],
  providers: [Contrib/lymeverenigingMemberCheckerService],
})
export class Contrib/lymeverenigingMemberCheckerModule {}
