export enum LoadAllGuildsCommandsResponseError {
  NONE = 0,
  UNKOWN = 1,
}

export interface LoadAllGuildsCommandsResponse {
  success: boolean;
  error: LoadAllGuildsCommandsResponseError;
}
