import { CommonModule } from '@common/common';
import { EmailConfig } from '@common/common/emailConfig/emailConfig.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailerController } from './emailer.controller';
import { EmailerService } from './emailer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    TypeOrmModule.forFeature([EmailConfig]),
  ],
  controllers: [EmailerController],
  providers: [EmailerService],
})
export class EmailerModule {}
