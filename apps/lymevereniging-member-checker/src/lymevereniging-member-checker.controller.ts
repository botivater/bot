import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { SystemEventPattern } from '@common/common/SystemEventPattern.enum';
import { GuildMemberAddedDto } from '@common/common/SystemEventPatternDto/guild-member-added.dto';
import { Body, Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Controller()
export class LymeverenigingMemberCheckerController {
  constructor(
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {}

  @MessagePattern({ cmd: 'checkMemberStatus' })
  async checkMemberStatus(
    @Body() checkMemberStatusDto: CheckMemberStatusDto,
  ): Promise<CheckMemberStatusCode> {
    return await this.lymeverenigingMemberCheckerService.checkMemberStatus(
      checkMemberStatusDto,
    );
  }

  @EventPattern(SystemEventPattern.GUILD_MEMBER_ADDED)
  async guildMemberAdded(@Body() guildMemberAddedDto: GuildMemberAddedDto) {
    console.log('guildMemberAdded: ' + guildMemberAddedDto.snowflake);
  }
}
