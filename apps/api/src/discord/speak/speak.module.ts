import { forwardRef, Module } from '@nestjs/common';
import { SpeakService } from './speak.service';
import { SpeakController } from './speak.controller';
import { ApiModule } from '../../api.module';

@Module({
  imports: [forwardRef(() => ApiModule)],
  controllers: [SpeakController],
  providers: [SpeakService],
})
export class SpeakModule {}
