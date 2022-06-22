import { CommandAlias } from '@common/common/commandAlias/commandAlias.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCommandAliasDto } from './dto/create-command-alias.dto';
import { UpdateCommandAliasDto } from './dto/update-command-alias.dto';

@Injectable()
export class CommandAliasService {
  private readonly logger = new Logger(CommandAliasService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(CommandAlias)
    private readonly commandAliasRepository: Repository<CommandAlias>,
  ) {}

  async create(createCommandAliasDto: CreateCommandAliasDto) {
    const { guildId, ...dto } = createCommandAliasDto;
    const commandAlias = this.commandAliasRepository.create({
      ...dto,
      guild: { id: +guildId },
    });
    return await this.commandAliasRepository.save(commandAlias);
  }

  async findAll(options?: FindManyOptions<CommandAlias>) {
    return await this.commandAliasRepository.find(options);
  }

  async findOne(options: FindOneOptions<CommandAlias>) {
    return await this.commandAliasRepository.findOne(options);
  }

  async update(id: number, updateCommandAliasDto: UpdateCommandAliasDto) {
    const commandAlias = await this.commandAliasRepository.findOneBy({ id });
    this.commandAliasRepository.merge(commandAlias, updateCommandAliasDto);
    return await this.commandAliasRepository.save(commandAlias);
  }

  async remove(id: number) {
    return await this.commandAliasRepository.delete(id);
  }
}
