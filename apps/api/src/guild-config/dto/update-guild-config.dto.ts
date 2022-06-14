import { PartialType } from '@nestjs/mapped-types';
import { CreateGuildConfigDto } from './create-guild-config.dto';

export class UpdateGuildConfigDto extends PartialType(CreateGuildConfigDto) {}
