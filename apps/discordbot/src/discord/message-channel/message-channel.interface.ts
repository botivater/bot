import { Guild } from '@common/common/guild/guild.entity';

export interface MessageChannel {
  send(guild: Guild, message: string): Promise<void>;
}
