import { PartialType } from '@nestjs/mapped-types';
import { CreateGuildMemberDto } from './create-guild-member.dto';

export class UpdateGuildMemberDto extends PartialType(CreateGuildMemberDto) {}
