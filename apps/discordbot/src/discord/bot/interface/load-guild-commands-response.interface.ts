export enum LoadGuildCommandsResponseError {
  NONE = 0,
  UNKOWN = 1,
  NOT_FOUND = 2,
}

export interface LoadGuildCommandsResponse {
  success: boolean;
  error: LoadGuildCommandsResponseError;
}
