import { Message } from '@common/common/message/message.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return await this.messageRepository.save(message);
  }

  async findAll(options?: FindManyOptions<Message>) {
    return await this.messageRepository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<Message>) {
    return await this.messageRepository.findOne(options);
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOneBy({ id });
    this.messageRepository.merge(message, updateMessageDto);
    return await this.messageRepository.save(message);
  }

  async remove(id: number) {
    return await this.messageRepository.delete(id);
  }
}
