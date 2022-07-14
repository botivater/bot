import { MessageActionRow } from '../type/message-action-row';

export class SendMessageDto {
  public channelSnowflake: string;
  public message: string;
  public components: MessageActionRow[];
}
