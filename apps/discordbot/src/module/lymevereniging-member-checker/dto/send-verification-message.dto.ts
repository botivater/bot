export class SendVerificationMessageDto {
  channelSnowflake?: string;
  userSnowflake?: string;
  type: 'user' | 'channel';
}
