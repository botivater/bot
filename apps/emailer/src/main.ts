import { NestFactory } from '@nestjs/core';
import { EmailerModule } from './emailer.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailerModule);
  await app.listen(3000);
}
bootstrap();
