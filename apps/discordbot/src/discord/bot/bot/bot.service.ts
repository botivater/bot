import { Guild } from '@common/common/guild/guild.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandService } from '../../command/command.service';
import { IBotService } from '../interface/bot-service.interface';

export class NotFoundError extends Error {}

@Injectable()
export class BotService implements IBotService {
  private readonly logger = new Logger(BotService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
    private readonly commandService: CommandService,
  ) {}

  async loadAllGuildsCommands(): Promise<void> {
    const databaseGuilds = await this.guildRepository.find();

    await this.commandService.putGuildsCommands(databaseGuilds);
  }

  async loadGuildCommands(guildId: number): Promise<void> {
    const databaseGuild = await this.guildRepository.findOneBy({
      id: guildId,
    });
    if (!databaseGuild) throw new NotFoundError();

    await this.commandService.putGuildCommands(databaseGuild);
  }
}
