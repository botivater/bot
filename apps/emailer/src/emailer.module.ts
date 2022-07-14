import { CommonModule } from '@common/common';
import { EmailConfig } from '@common/common/emailConfig/emailConfig.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailerController } from './emailer.controller';
import { EmailerService } from './emailer.service';
import { EmailVerification } from './entity/email-verification.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    TypeOrmModule.forFeature([EmailConfig, EmailVerification]),
  ],
  controllers: [EmailerController],
  providers: [EmailerService],
})
export class EmailerModule {}
