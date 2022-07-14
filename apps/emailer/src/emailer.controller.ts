import { CheckVerificationDto } from '@common/common/apps/emailer/dto/check-verification.dto';
import { SendEmailDto } from '@common/common/apps/emailer/dto/send-email.dto';
import { SendVerificationEmailDto } from '@common/common/apps/emailer/dto/send-verification-email.dto';
import { EmailerMessagePattern } from '@common/common/apps/emailer/enum/EmailerMessagePattern.enum';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailerService } from './emailer.service';

@Controller()
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @MessagePattern({ cmd: EmailerMessagePattern.SEND_EMAIL })
  async sendEmail(@Body() sendMailDto: SendEmailDto): Promise<{
    success: boolean;
    error: string;
  }> {
    try {
      await this.emailerService.sendEmail(sendMailDto);

      return { success: true, error: '' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  @MessagePattern({ cmd: EmailerMessagePattern.SEND_VERIFICATION_EMAIL })
  async sendVerificationEmail(
    @Body() sendVerificationEmailDto: SendVerificationEmailDto,
  ): Promise<{
    success: boolean;
    error: string;
  }> {
    try {
      await this.emailerService.sendVerificationEmail(sendVerificationEmailDto);

      return { success: true, error: '' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  @MessagePattern({ cmd: EmailerMessagePattern.CHECK_VERIFICATION })
  async checkVerification(
    @Body() checkVerificationDto: CheckVerificationDto,
  ): Promise<{
    success: boolean;
    error: string;
  }> {
    try {
      await this.emailerService.checkVerification(checkVerificationDto);

      return { success: true, error: '' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
