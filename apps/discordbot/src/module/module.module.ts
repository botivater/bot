import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LymeverenigingMemberCheckerModule } from './lymevereniging-member-checker/lymevereniging-member-checker.module';

@Module({
  imports: [ConfigModule, LymeverenigingMemberCheckerModule],
})
export class ModuleModule {}
