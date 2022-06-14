import { PartialType } from '@nestjs/mapped-types';
import { CreateCommandInvocationDto } from './create-command-invocation.dto';

export class UpdateCommandInvocationDto extends PartialType(
  CreateCommandInvocationDto,
) {}
