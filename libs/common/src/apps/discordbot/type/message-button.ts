import { ButtonStyle } from 'discord.js';

export class MessageButton {
  public customId = '';
  public label = '';
  public style: ButtonStyle = null;
  public disabled = false;
  public emoji = '';
}
