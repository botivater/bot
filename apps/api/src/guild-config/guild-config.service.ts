import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateGuildConfigDto } from './dto/create-guild-config.dto';
import { UpdateGuildConfigDto } from './dto/update-guild-config.dto';

@Injectable({ scope: Scope.REQUEST })
export class GuildConfigService {
  private readonly logger = new Logger(GuildConfigService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(GuildConfig)
    private readonly guildConfigRepository: Repository<GuildConfig>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createGuildConfigDto: CreateGuildConfigDto) {
    const guildConfig = this.guildConfigRepository.create(createGuildConfigDto);
    return await this.guildConfigRepository.save(guildConfig);
  }

  async findAll(options?: FindManyOptions<GuildConfig>) {
    return await this.guildConfigRepository.find(options);
  }

  async findOne(options: FindOneOptions<GuildConfig>) {
    return await this.guildConfigRepository.findOne(options);
  }

  async update(id: number, updateGuildConfigDto: UpdateGuildConfigDto) {
    const guildConfig = await this.guildConfigRepository.findOneBy({ id });
    this.guildConfigRepository.merge(guildConfig, updateGuildConfigDto);
    return await this.guildConfigRepository.save(guildConfig);
  }

  async remove(id: number) {
    return await this.guildConfigRepository.delete({ id });
  }
}
