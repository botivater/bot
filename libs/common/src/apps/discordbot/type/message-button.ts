import { MessageButtonStyle } from 'discord.js';

export class MessageButton {
  public customId = '';
  public label = '';
  public style: MessageButtonStyle = null;
  public disabled = false;
  public emoji = '';
}
