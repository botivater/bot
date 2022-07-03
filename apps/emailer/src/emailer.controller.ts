import { Controller, Get } from '@nestjs/common';
import { EmailerService } from './emailer.service';

@Controller()
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Get()
  getHello(): string {
    return this.emailerService.getHello();
  }
}
