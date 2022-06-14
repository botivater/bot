import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCommandFlowGroupDto } from './dto/create-command-flow-group.dto';
import { UpdateCommandFlowGroupDto } from './dto/update-command-flow-group.dto';

@Injectable({ scope: Scope.REQUEST })
export class CommandFlowGroupService {
  private readonly logger = new Logger(CommandFlowGroupService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(CommandFlowGroup)
    private readonly commandFlowGroupRepository: Repository<CommandFlowGroup>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createCommandFlowGroupDto: CreateCommandFlowGroupDto) {
    const commandFlowGroup = this.commandFlowGroupRepository.create(
      createCommandFlowGroupDto,
    );
    return await this.commandFlowGroupRepository.save(commandFlowGroup);
  }

  async findAll(options?: FindManyOptions<CommandFlowGroup>) {
    return await this.commandFlowGroupRepository.find(options);
  }

  async findOne(options: FindOneOptions<CommandFlowGroup>) {
    return await this.commandFlowGroupRepository.findOne(options);
  }

  async update(
    id: number,
    updateCommandFlowGroupDto: UpdateCommandFlowGroupDto,
  ) {
    const commandFlowGroup = await this.commandFlowGroupRepository.findOneBy({
      id,
    });
    this.commandFlowGroupRepository.merge(
      commandFlowGroup,
      updateCommandFlowGroupDto,
    );
    return await this.commandFlowGroupRepository.save(commandFlowGroup);
  }

  async remove(id: number) {
    return await this.commandFlowGroupRepository.delete({ id });
  }
}
