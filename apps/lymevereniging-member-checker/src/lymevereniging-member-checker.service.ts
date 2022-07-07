import { CheckMemberStatusDto } from '@common/common/apps/lymevereniging-member-checker/dto/check-member-status.dto';
import { CheckMemberStatusCode } from '@common/common/apps/lymevereniging-member-checker/enum/check-member-status-code';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CheckMemberStatusApiResponseDto } from './check-member-status-api-response.dto';

@Injectable()
export class LymeverenigingMemberCheckerService {
  private readonly logger = new Logger(LymeverenigingMemberCheckerService.name);
  private static readonly API4_ENDPOINT =
    'https://lyme.thiersupport.eu/civicrm/ajax/api4';

  /**
   *
   */
  constructor(private readonly configService: ConfigService) {
    // this.checkMemberStatus({ email: 'jonas@jonasclaes.be' }).then(console.log);
    // this.checkMemberStatus({ email: 'm.vanderwaals40@gmail.com' }).then(
    //   console.log,
    // );
  }

  async checkMemberStatus(
    checkMemberStatusDto: CheckMemberStatusDto,
  ): Promise<CheckMemberStatusCode> {
    const { email } = checkMemberStatusDto;

    const data = {
      select: ['status_id'],
      join: [
        ['Email AS email', 'LEFT', ['email.contact_id', '=', 'contact_id']],
      ],
      where: [
        ['email.email', '=', email],
        ['membership_type_id', 'IN', [1, 5, 6, 2]],
        ['status_id', 'IN', [1, 2, 3]],
      ],
      limit: 25,
    };

    try {
      const response = await axios.post<CheckMemberStatusApiResponseDto>(
        `${LymeverenigingMemberCheckerService.API4_ENDPOINT}/Membership/get`,
        new URLSearchParams({ params: JSON.stringify(data) }).toString(),
        {
          headers: {
            'X-Civi-Auth': `Bearer ${this.configService.getOrThrow(
              'LYMEVERENIGING_CIVI_API_KEY',
            )}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (response.status !== 200) {
        return CheckMemberStatusCode.API_ERROR;
      }

      this.logger.debug(`checkMemberStatus({ email: '${email}' })`);
      this.logger.debug(response.data);

      return response.data.count > 0
        ? CheckMemberStatusCode.MEMBER
        : CheckMemberStatusCode.NOT_MEMBER;
    } catch (err) {
      this.logger.error(err);
      return CheckMemberStatusCode.API_ERROR;
    }
  }
}
