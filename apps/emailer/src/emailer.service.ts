import {
  EmailConfig,
  EmailType,
} from '@common/common/emailConfig/emailConfig.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { CONTEXT, RequestContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransport, Transporter } from 'nodemailer';
import { Repository } from 'typeorm';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable({ scope: Scope.REQUEST })
export class EmailerService {
  private readonly logger = new Logger(EmailerService.name);

  /**
   *
   */
  constructor(
    @Inject(CONTEXT) private ctx: RequestContext,
    @InjectRepository(EmailConfig)
    private readonly emailConfigRepository: Repository<EmailConfig>,
  ) {}

  async sendEmail(sendMailDto: SendMailDto) {
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
}
