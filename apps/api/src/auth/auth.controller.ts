import {
  Controller,
  Get,
  Post,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { LocalGuard } from './local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   *
   */
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login using credentials' })
  @ApiBody({
    required: true,
    description: 'Login credentials',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          example: 'john@doe.com',
        },
        password: {
          type: 'string',
          example: 'johndoe123',
        },
      },
    },
  })
  @UseGuards(LocalGuard)
  @Version(VERSION_NEUTRAL)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Get self using JWT token' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Version(VERSION_NEUTRAL)
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }
}
