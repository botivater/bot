import { PartialType } from '@nestjs/swagger';
import { CreateCommandAliasDto } from './create-command-alias.dto';

export class UpdateCommandAliasDto extends PartialType(CreateCommandAliasDto) {}
