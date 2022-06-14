import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, In, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateGuildMemberDto } from './dto/create-guild-member.dto';
import { UpdateGuildMemberDto } from './dto/update-guild-member.dto';

@Injectable({ scope: Scope.REQUEST })
export class GuildMemberService {
  private readonly logger = new Logger(GuildMemberService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createGuildMemberDto: CreateGuildMemberDto) {
    const guildMember = this.guildMemberRepository.create(createGuildMemberDto);
    return await this.guildMemberRepository.save(guildMember);
  }

  async findAll(options?: FindManyOptions<GuildMember>) {
    return await this.guildMemberRepository.find({
      where: {
        guild: {
          tenant: {
            id: In(this.request.user.tenants.map((t) => t.id)),
          },
        },
      },
      ...options,
    });
  }

  async findOne(options: FindOneOptions<GuildMember>) {
    return await this.guildMemberRepository.findOne(options);
  }

  async update(id: number, updateGuildMemberDto: UpdateGuildMemberDto) {
    const guildMember = await this.guildMemberRepository.findOneBy({ id });
    this.guildMemberRepository.merge(guildMember, updateGuildMemberDto);
    return await this.guildMemberRepository.save(guildMember);
  }

  async remove(id: number) {
    return await this.guildMemberRepository.delete({ id });
  }
}
