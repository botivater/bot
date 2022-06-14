import { Module } from '@nestjs/common';
import { GuildMemberService } from './guild-member.service';
import { GuildMemberController } from './guild-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuildMember])],
  controllers: [GuildMemberController],
  providers: [GuildMemberService],
})
export class GuildMemberModule {}
