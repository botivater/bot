import { CommandList } from '@common/common/commandList/commandList.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCommandListDto } from './dto/create-command-list.dto';
import { UpdateCommandListDto } from './dto/update-command-list.dto';

@Injectable({ scope: Scope.REQUEST })
export class CommandListService {
  private readonly logger = new Logger(CommandListService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(CommandList)
    private readonly commandListRepository: Repository<CommandList>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createCommandListDto: CreateCommandListDto) {
    const commandList = this.commandListRepository.create(createCommandListDto);
    return await this.commandListRepository.save(commandList);
  }

  async findAll(options?: FindManyOptions<CommandList>) {
    return await this.commandListRepository.find(options);
  }

  async findOne(options: FindOneOptions<CommandList>) {
    return await this.commandListRepository.findOne(options);
  }

  async update(id: number, updateCommandListDto: UpdateCommandListDto) {
    const commandList = await this.commandListRepository.findOneBy({ id });
    this.commandListRepository.merge(commandList, updateCommandListDto);
    return await this.commandListRepository.save(commandList);
  }

  async remove(id: number) {
    return await this.commandListRepository.delete({ id });
  }
}
