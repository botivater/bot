import { Injectable, Logger } from '@nestjs/common';
import { ApiService } from '../../api.service';
import { LoadGuildCommandsDto } from './dto/load-guild-commands.dto';

@Injectable()
export class LoadGuildCommandsService {
  private readonly logger = new Logger(LoadGuildCommandsService.name);

  /**
   *
   */
  constructor(private readonly apiService: ApiService) {}

  loadGuildCommands(loadGuildCommandsDto: LoadGuildCommandsDto) {
    return this.apiService.loadGuildCommands(loadGuildCommandsDto);
  }
}
