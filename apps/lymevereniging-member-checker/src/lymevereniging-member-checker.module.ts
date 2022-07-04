import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LymeverenigingMemberCheckerController } from './lymevereniging-member-checker.controller';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LymeverenigingMemberCheckerController],
  providers: [LymeverenigingMemberCheckerService],
})
export class LymeverenigingMemberCheckerModule {}
