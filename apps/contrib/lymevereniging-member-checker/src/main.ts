import { NestFactory } from '@nestjs/core';
import { Contrib/lymeverenigingMemberCheckerModule } from './contrib/lymevereniging-member-checker.module';

async function bootstrap() {
  const app = await NestFactory.create(Contrib/lymeverenigingMemberCheckerModule);
  await app.listen(3000);
}
bootstrap();
