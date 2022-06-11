import { Guild } from '@common/common/guild/guild.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';

@Injectable({ scope: Scope.REQUEST })
export class GuildService {
  private readonly logger = new Logger(GuildService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild) private guildRepository: Repository<Guild>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  create(createGuildDto: CreateGuildDto) {
    const guild = this.guildRepository.create(createGuildDto);
    return this.guildRepository.save(guild);
  }

  findAll(options?: FindManyOptions<Guild>) {
    return this.guildRepository.find({
      where: {
        tenant: {
          id: In(this.request.user.tenants.map((t) => t.id)),
        },
      },
      ...options,
    });
  }

  findOne(options: FindOneOptions<Guild>) {
    return this.guildRepository.findOne(options);
  }

  update(id: number, updateGuildDto: UpdateGuildDto) {
    return this.guildRepository.update({ id }, updateGuildDto);
  }

  remove(id: number) {
    return this.guildRepository.delete({ id });
  }
}
