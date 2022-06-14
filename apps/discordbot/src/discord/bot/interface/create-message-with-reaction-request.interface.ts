export interface CreateMessageWithReactionRequest {
  channelSnowflake: string;
  message: string;
  reactions: string[];
}
