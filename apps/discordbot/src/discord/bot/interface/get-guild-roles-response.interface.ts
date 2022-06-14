import { GuildRole } from './guild-role.interface';

export enum GetGuildRolesResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface GetGuildRolesResponse {
  success: boolean;
  error: GetGuildRolesResponseError;
  roles: GuildRole[];
}
