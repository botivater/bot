import { Controller, Get } from '@nestjs/common';
import { LymeverenigingMemberCheckerService } from './lymevereniging-member-checker.service';

@Controller()
export class LymeverenigingMemberCheckerController {
  constructor(
    private readonly lymeverenigingMemberCheckerService: LymeverenigingMemberCheckerService,
  ) {}

  @Get()
  getHello(): string {
    return this.lymeverenigingMemberCheckerService.getHello();
  }
}
