export enum LoadGuildCommandsResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface LoadGuildCommandsResponse {
  success: boolean;
  error: LoadGuildCommandsResponseError;
}
