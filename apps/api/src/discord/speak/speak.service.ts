import { Injectable, Logger } from '@nestjs/common';
import { ApiService } from '../../api.service';
import { SpeakDto } from './dto/speak.dto';

@Injectable()
export class SpeakService {
  private readonly logger = new Logger(SpeakService.name);

  /**
   *
   */
  constructor(private readonly apiService: ApiService) {}

  speak(speakDto: SpeakDto) {
    return this.apiService.speak(speakDto);
  }
}
