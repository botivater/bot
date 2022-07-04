import { Module } from '@nestjs/common';
import { LymeverenigingMemberCheckerModule } from './lymevereniging-member-checker/lymevereniging-member-checker.module';

@Module({
  imports: [LymeverenigingMemberCheckerModule],
})
export class ModuleModule {}
