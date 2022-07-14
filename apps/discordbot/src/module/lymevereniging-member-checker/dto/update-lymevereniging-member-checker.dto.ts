import { PartialType } from '@nestjs/mapped-types';
import { CreateLymeverenigingMemberCheckerDto } from './create-lymevereniging-member-checker.dto';

export class UpdateLymeverenigingMemberCheckerDto extends PartialType(CreateLymeverenigingMemberCheckerDto) {
  id: number;
}
