import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { SpeakDto } from './dto/speak.dto';
import { SpeakService } from './speak.service';

@UseGuards(JwtGuard)
@Controller('discord/speak')
export class SpeakController {
  constructor(private readonly speakService: SpeakService) {}

  @Post()
  speak(@Body() speakDto: SpeakDto) {
    return this.speakService.speak(speakDto);
  }
}
