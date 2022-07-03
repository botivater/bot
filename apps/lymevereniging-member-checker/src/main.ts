import { NestFactory } from '@nestjs/core';
import { LymeverenigingMemberCheckerModule } from './lymevereniging-member-checker.module';

async function bootstrap() {
  const app = await NestFactory.create(LymeverenigingMemberCheckerModule);
  await app.listen(3000);
}
bootstrap();
