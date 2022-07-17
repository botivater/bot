import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { LymeverenigingMemberCheckerMessagePattern } from '@common/common/apps/lymevereniging-member-checker/enum/LymeverenigingMemberCheckerMessagePattern.enum';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Controller()
export class LymeverenigingMemberCheckerController {
  constructor(
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {}

  @MessagePattern({
    cmd: LymeverenigingMemberCheckerMessagePattern.CHECK_MEMBER_STATUS,
  })
  async checkMemberStatus(
    @Body() checkMemberStatusDto: CheckMemberStatusDto,
  ): Promise<CheckMemberStatusCode> {
    return await this.lymeverenigingMemberCheckerService.checkMemberStatus(
      checkMemberStatusDto,
    );
  }
}
