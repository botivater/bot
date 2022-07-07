import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Controller('module/lymevereniging-member-checker')
export class LymeverenigingMemberCheckerController {
  constructor(
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {}

  @Get('check-member-status')
  checkMemberStatus(
    @Query('email') email: string,
  ): Observable<CheckMemberStatusCode> {
    return this.lymeverenigingMemberCheckerService.checkMemberStatus({ email });
  }
}
