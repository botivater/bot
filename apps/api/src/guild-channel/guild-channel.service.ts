import { GuildChannel } from '@common/common/guildChannel/guildChannel.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateGuildChannelDto } from './dto/create-guild-channel.dto';
import { UpdateGuildChannelDto } from './dto/update-guild-channel.dto';

@Injectable()
export class GuildChannelService {
  private readonly logger = new Logger(GuildChannelService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(GuildChannel)
    private readonly guildChannelRepository: Repository<GuildChannel>,
  ) {}

  async create(createGuildChannelDto: CreateGuildChannelDto) {
    const guildChannel = this.guildChannelRepository.create(
      createGuildChannelDto,
    );
    return await this.guildChannelRepository.save(guildChannel);
  }

  async findAll(options?: FindManyOptions<GuildChannel>) {
    return await this.guildChannelRepository.find(options);
  }

  async findOne(options: FindOneOptions<GuildChannel>) {
    return await this.guildChannelRepository.findOne(options);
  }

  async update(id: number, updateGuildChannelDto: UpdateGuildChannelDto) {
    const guildChannel = await this.guildChannelRepository.findOneBy({ id });
    this.guildChannelRepository.merge(guildChannel, updateGuildChannelDto);
    return await this.guildChannelRepository.save(guildChannel);
  }

  async remove(id: number) {
    return await this.guildChannelRepository.delete(id);
  }
}
