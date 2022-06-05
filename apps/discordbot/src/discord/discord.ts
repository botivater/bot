import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Intents } from 'discord.js';

@Injectable()
export class Discord extends Client {
  private readonly logger = new Logger(Discord.name);

  /**
   * Construct a new instance of discord.Client with the required intents.
   */
  constructor(private readonly configService: ConfigService) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
      partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    });

    this.logger.debug('Discord instance configured');
  }

  public async setup() {
    await this.login(this.configService.getOrThrow('BOT_TOKEN'));
    this.logger.debug('Discord client logged in');
  }
}
