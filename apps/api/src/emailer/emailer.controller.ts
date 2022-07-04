import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { JwtGuard } from '../auth/jwt.guard';
import { SendMailDto } from './dto/send-mail.dto';

@UseGuards(JwtGuard)
@Controller('emailer')
export class EmailerController {
  constructor(
    @Inject('EMAILER_SERVICE') private readonly emailerService: ClientProxy,
  ) {}

  @Post('/send-mail')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return new Promise((resolve, reject) => {
      this.emailerService
        .send({ cmd: 'sendMail' }, sendMailDto)
        .pipe(timeout(30 * 1000))
        .subscribe({
          next: resolve,
          error: reject,
        });
    });
  }
}
