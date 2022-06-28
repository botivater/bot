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

  async create(createGuildDto: CreateGuildDto) {
    const guild = this.guildRepository.create(createGuildDto);
    return await this.guildRepository.save(guild);
  }

  async findAll(options?: FindManyOptions<Guild>) {
    return await this.guildRepository.find({
      where: {
        tenant: {
          id: In(this.request.user.tenants.map((t) => t.id)),
        },
      },
      ...options,
    });
  }

  async findOne(options: FindOneOptions<Guild>) {
    return await this.guildRepository.findOne(options);
  }

  async update(id: number, updateGuildDto: UpdateGuildDto) {
    const guild = await this.guildRepository.findOneBy({ id });
    this.guildRepository.merge(guild, updateGuildDto);
    return await this.guildRepository.save(guild);
  }

  async remove(id: number) {
    return await this.guildRepository.softDelete({ id });
  }
}
