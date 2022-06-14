import { GuildMember } from './guild-member.interface';

export enum GetGuildMembersResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface GetGuildMembersResponse {
  success: boolean;
  error: GetGuildMembersResponseError;
  members: GuildMember[];
}
