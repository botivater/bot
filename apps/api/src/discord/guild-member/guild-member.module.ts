import { forwardRef, Module } from '@nestjs/common';
import { GuildMemberService } from './guild-member.service';
import { GuildMemberController } from './guild-member.controller';
import { ApiModule } from '../../api.module';

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [GuildMemberController],
  providers: [GuildMemberService],
})
export class GuildMemberModule {}
