import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class LymeverenigingMemberCheckerService {
  /**
   *
   */
  constructor(
    @Inject('LYMEVERENIGING_MEMBER_CHECKER_SERVICE')
    private readonly lymeverenigingMemberCheckerService: ClientProxy,
  ) {}

  checkMemberStatus(
    checkMemberStatusDto: CheckMemberStatusDto,
  ): Promise<CheckMemberStatusCode> {
    return new Promise((resolve, reject) => {
      this.lymeverenigingMemberCheckerService
        .send({ cmd: 'checkMemberStatus' }, checkMemberStatusDto)
        .pipe(timeout(5000))
        .subscribe({
          next: resolve,
          error: reject,
        });
    });
  }
}
