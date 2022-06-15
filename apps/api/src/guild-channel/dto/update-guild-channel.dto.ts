import { PartialType } from '@nestjs/mapped-types';
import { CreateGuildChannelDto } from './create-guild-channel.dto';

export class UpdateGuildChannelDto extends PartialType(CreateGuildChannelDto) {}
