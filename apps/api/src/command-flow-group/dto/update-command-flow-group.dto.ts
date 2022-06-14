import { PartialType } from '@nestjs/mapped-types';
import { CreateCommandFlowGroupDto } from './create-command-flow-group.dto';

export class UpdateCommandFlowGroupDto extends PartialType(
  CreateCommandFlowGroupDto,
) {}
