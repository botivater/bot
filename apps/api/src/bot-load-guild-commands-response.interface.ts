export enum BotLoadGuildCommandsResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface BotLoadGuildCommandsResponse {
  success: boolean;
  error: BotLoadGuildCommandsResponseError;
}
