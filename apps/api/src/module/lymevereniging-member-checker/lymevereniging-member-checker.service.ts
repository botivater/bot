import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LymeverenigingMemberCheckerService {
  /**
   *
   */
  constructor(
    @Inject('LYMEVERENIGING_MEMBER_CHECKER_SERVICE')
    private readonly lymeverenigingMemberCheckerService: ClientProxy,
  ) {}

  checkMemberStatus(checkMemberStatusDto: CheckMemberStatusDto) {
    return this.lymeverenigingMemberCheckerService.send<CheckMemberStatusCode>(
      'checkMemberStatus',
      checkMemberStatusDto,
    );
  }
}
