import { CheckVerificationDto } from '@common/common/apps/emailer/dto/check-verification.dto';
import { SendEmailDto } from '@common/common/apps/emailer/dto/send-email.dto';
import { SendVerificationEmailDto } from '@common/common/apps/emailer/dto/send-verification-email.dto';
import {
  EmailConfig,
  EmailType,
} from '@common/common/emailConfig/emailConfig.entity';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { createTransport, Transporter } from 'nodemailer';
import { Repository } from 'typeorm';
import { EmailVerification } from './entity/email-verification.entity';

@Injectable({ scope: Scope.REQUEST })
export class EmailerService {
  private readonly logger = new Logger(EmailerService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(EmailConfig)
    private readonly emailConfigRepository: Repository<EmailConfig>,
  ) {}

  async sendEmail(sendMailDto: SendEmailDto) {
    const { tenantId, to, subject, body, bodyHtml } = sendMailDto;

    const emailConfig = await this.emailConfigRepository.findOne({
      where: {
        tenant: {
          id: tenantId,
        },
      },
    });

    if (!emailConfig) throw new Error('Email config not found');

    let transporter: Transporter;

    if (emailConfig.emailType === EmailType.SMTP) {
      transporter = createTransport(emailConfig.smtpConfiguration);
    }

    if (!transporter) throw new Error('No transporter configured.');

    try {
      await transporter.sendMail({
        from: emailConfig.from,
        to: to.join(', '),
        subject,
        text: body,
        html: bodyHtml,
      });

      this.logger.debug(`Email sent to ${to.join(', ')}`);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async sendVerificationEmail(
    sendVerificationEmailDto: SendVerificationEmailDto,
  ) {
    const { verification, ...sendEmailDto } = sendVerificationEmailDto;

    try {
      await this.sendEmail(sendEmailDto);

      // Save the token
      const emailVerification = new EmailVerification();
      emailVerification.reference = verification.reference;
      emailVerification.verificationToken = verification.verificationToken;

      await this.emailVerificationRepository.save(emailVerification);
    } catch (err) {
      throw err;
    }
  }

  async checkVerification(checkVerificationDto: CheckVerificationDto) {
    const { reference, verificationToken } = checkVerificationDto.verification;

    try {
      const emailVerification =
        await this.emailVerificationRepository.findOneBy({
          reference,
          verificationToken,
        });

      if (!emailVerification) throw new Error('Verification not found');

      const tUtc = moment.utc();
      const tSaved = moment(emailVerification.createdAt);
      if (tUtc.diff(tSaved, 'hours') >= 1) {
        throw new Error('Verification expired');
      }

      await this.emailVerificationRepository.softRemove(emailVerification);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
