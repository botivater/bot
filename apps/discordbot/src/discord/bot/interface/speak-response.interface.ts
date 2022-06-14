export enum SpeakResponseError {
  NONE = 0,
  UNKNOWN = 1,
  NOT_FOUND = 2,
}

export interface SpeakResponse {
  success: boolean;
  error: SpeakResponseError;
}
