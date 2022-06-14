import { CommandInvocation } from '@common/common/commandInvocation/commandInvocation.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCommandInvocationDto } from './dto/create-command-invocation.dto';
import { UpdateCommandInvocationDto } from './dto/update-command-invocation.dto';

@Injectable({ scope: Scope.REQUEST })
export class CommandInvocationService {
  private readonly logger = new Logger(CommandInvocationService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(CommandInvocation)
    private readonly commandInvocationRepository: Repository<CommandInvocation>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createCommandInvocationDto: CreateCommandInvocationDto) {
    const commandInvocation = this.commandInvocationRepository.create(
      createCommandInvocationDto,
    );
    return await this.commandInvocationRepository.save(commandInvocation);
  }

  async findAll(options?: FindManyOptions<CommandInvocation>) {
    return await this.commandInvocationRepository.find(options);
  }

  async findOne(options: FindOneOptions<CommandInvocation>) {
    return await this.commandInvocationRepository.findOne(options);
  }

  async update(
    id: number,
    updateCommandInvocationDto: UpdateCommandInvocationDto,
  ) {
    const commandInvocation = await this.commandInvocationRepository.findOneBy({
      id,
    });
    this.commandInvocationRepository.merge(
      commandInvocation,
      updateCommandInvocationDto,
    );
    return await this.commandInvocationRepository.save(commandInvocation);
  }

  async remove(id: number) {
    return await this.commandInvocationRepository.delete({ id });
  }
}
