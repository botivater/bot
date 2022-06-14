export enum CreateMessageWithReactionResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface CreateMessageWithReactionResponse {
  success: boolean;
  error: CreateMessageWithReactionResponseError;
  messageSnowflake: string;
}
