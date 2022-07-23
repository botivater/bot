import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';

@Injectable()
export class Discord extends Client {
  private readonly logger = new Logger(Discord.name);

  /**
   * Construct a new instance of discord.Client with the required intents.
   */
  constructor(private readonly configService: ConfigService) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });

    this.logger.debug('Discord instance configured');
  }

  public async setup() {
    await this.login(this.configService.getOrThrow('BOT_TOKEN'));
    this.logger.debug('Discord client logged in');
  }
}
