import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailerService {
  getHello(): string {
    return 'Hello World!';
  }
}
