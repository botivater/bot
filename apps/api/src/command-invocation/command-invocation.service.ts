import { Injectable } from '@nestjs/common';
import { CreateCommandInvocationDto } from './dto/create-command-invocation.dto';
import { UpdateCommandInvocationDto } from './dto/update-command-invocation.dto';

@Injectable()
export class CommandInvocationService {
  create(createCommandInvocationDto: CreateCommandInvocationDto) {
    return 'This action adds a new commandInvocation';
  }

  findAll() {
    return `This action returns all commandInvocation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commandInvocation`;
  }

  update(id: number, updateCommandInvocationDto: UpdateCommandInvocationDto) {
    return `This action updates a #${id} commandInvocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} commandInvocation`;
  }
}
