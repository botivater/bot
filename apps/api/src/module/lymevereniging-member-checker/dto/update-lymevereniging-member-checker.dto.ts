import { PartialType } from '@nestjs/swagger';
import { CreateLymeverenigingMemberCheckerDto } from './create-lymevereniging-member-checker.dto';

export class UpdateLymeverenigingMemberCheckerDto extends PartialType(CreateLymeverenigingMemberCheckerDto) {}
