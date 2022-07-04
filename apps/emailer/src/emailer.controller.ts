import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SendMailDto } from './dto/send-mail.dto';
import { EmailerService } from './emailer.service';

@Controller()
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @MessagePattern({ cmd: 'sendMail' })
  async sendMail(@Body() sendMailDto: SendMailDto): Promise<{
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
}
