import { Controller, Get } from '@nestjs/common';
import { Contrib/lymeverenigingMemberCheckerService } from './contrib/lymevereniging-member-checker.service';

@Controller()
export class Contrib/lymeverenigingMemberCheckerController {
  constructor(private readonly contrib/lymeverenigingMemberCheckerService: Contrib/lymeverenigingMemberCheckerService) {}

  @Get()
  getHello(): string {
    return this.contrib/lymeverenigingMemberCheckerService.getHello();
  }
}
