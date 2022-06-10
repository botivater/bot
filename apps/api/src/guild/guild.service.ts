import { Guild } from '@common/common/guild/guild.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';

@Injectable()
export class GuildService {
  private readonly logger = new Logger(GuildService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
  ) {}

  create(createGuildDto: CreateGuildDto) {
    return 'This action adds a new guild';
  }

  findAll() {
    return this.guildRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} guild`;
  }

  update(id: number, updateGuildDto: UpdateGuildDto) {
    return `This action updates a #${id} guild`;
  }

  remove(id: number) {
    return `This action removes a #${id} guild`;
  }
}
