import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
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
}
