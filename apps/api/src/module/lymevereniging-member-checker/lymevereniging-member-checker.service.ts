import { Injectable } from '@nestjs/common';
import { CreateLymeverenigingMemberCheckerDto } from './dto/create-lymevereniging-member-checker.dto';
import { UpdateLymeverenigingMemberCheckerDto } from './dto/update-lymevereniging-member-checker.dto';

@Injectable()
export class LymeverenigingMemberCheckerService {
  create(
    createLymeverenigingMemberCheckerDto: CreateLymeverenigingMemberCheckerDto,
  ) {
    return 'This action adds a new lymeverenigingMemberChecker';
  }

  findAll() {
    return `This action returns all lymeverenigingMemberChecker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lymeverenigingMemberChecker`;
  }

  update(
    id: number,
    updateLymeverenigingMemberCheckerDto: UpdateLymeverenigingMemberCheckerDto,
  ) {
    return `This action updates a #${id} lymeverenigingMemberChecker`;
  }

  remove(id: number) {
    return `This action removes a #${id} lymeverenigingMemberChecker`;
  }
}
