import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AuthService } from './auth/auth.service';
import { JwtGuard } from './auth/jwt.guard';
import { LocalGuard } from './auth/local.guard';

@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Version(VERSION_NEUTRAL)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Version(VERSION_NEUTRAL)
  @Get('auth/me')
  async me(@Request() req) {
    return req.user;
  }
}
