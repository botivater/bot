export enum BotCreateMessageWithReactionResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface BotCreateMessageWithReactionResponse {
  success: boolean;
  error: BotCreateMessageWithReactionResponseError;
  messageId: string;
}
