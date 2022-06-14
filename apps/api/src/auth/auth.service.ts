import { User } from '@common/common/user/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   *
   */
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({
      where: { email },
    });

    if (user) {
      const isValid = await compare(password, user.password);

      if (isValid) {
        const { password, ...result } = user;
        return result;
      } else {
        this.logger.log(`Failed login attempt for user ${email}`);
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
