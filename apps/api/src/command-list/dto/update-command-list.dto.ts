import { PartialType } from '@nestjs/mapped-types';
import { CreateCommandListDto } from './create-command-list.dto';

export class UpdateCommandListDto extends PartialType(CreateCommandListDto) {}
