export enum BotSpeakResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface BotSpeakResponse {
  success: boolean;
  error: BotSpeakResponseError;
}
