import { Injectable } from '@nestjs/common';
import { CreateCommandFlowGroupDto } from './dto/create-command-flow-group.dto';
import { UpdateCommandFlowGroupDto } from './dto/update-command-flow-group.dto';

@Injectable()
export class CommandFlowGroupService {
  create(createCommandFlowGroupDto: CreateCommandFlowGroupDto) {
    return 'This action adds a new commandFlowGroup';
  }

  findAll() {
    return `This action returns all commandFlowGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commandFlowGroup`;
  }

  update(id: number, updateCommandFlowGroupDto: UpdateCommandFlowGroupDto) {
    return `This action updates a #${id} commandFlowGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} commandFlowGroup`;
  }
}
