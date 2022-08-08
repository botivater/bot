import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@UseGuards(JwtGuard)
@Controller('module/lymevereniging-member-checker')
export class LymeverenigingMemberCheckerController {
  constructor(
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {}

  @Get('check-member-status')
  checkMemberStatus(
    @Query('email') email: string,
  ): Promise<CheckMemberStatusCode> {
    return this.lymeverenigingMemberCheckerService.checkMemberStatus({ email });
  }
}
