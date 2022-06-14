export enum LoadAllGuildsCommandsResponseError {
  NONE = 0,
  UNKNOWN = 1,
}

export interface LoadAllGuildsCommandsResponse {
  success: boolean;
  error: LoadAllGuildsCommandsResponseError;
}
