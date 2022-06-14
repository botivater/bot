import { GuildChannel } from './guild-channel.interface';

export enum GetGuildChannelsResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface GetGuildChannelsResponse {
  success: boolean;
  error: GetGuildChannelsResponseError;
  channels: GuildChannel[];
}
