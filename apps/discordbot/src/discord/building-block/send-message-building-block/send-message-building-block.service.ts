import { Injectable, Logger } from '@nestjs/common';
import { Discord } from '../../discord';
import Handlebars from 'handlebars';

export enum SendMessageTo {
  SENDER = 0,
  USER = 1,
  CHANNEL = 2,
}

@Injectable()
export class SendMessageBuildingBlockService {
  private readonly logger = new Logger(SendMessageBuildingBlockService.name);

  /**
   *
   */
  constructor(private readonly discord: Discord) {
    Handlebars.registerHelper('pickFirstName', function (name) {
      return name.split(' ')[0];
    });
  }

  public async handle(configuration: {
    toType: SendMessageTo;
    to: string;
    messageFormat: string;
    messageParameters: any;
  }) {
    try {
      const { toType, to, messageFormat, messageParameters } = configuration;

      const stringTemplate = Handlebars.compile(messageFormat);

      switch (toType) {
        case SendMessageTo.SENDER:
        case SendMessageTo.USER:
          await this.discord.users.fetch(to);
          const user = this.discord.users.cache.get(to);
          if (!user) throw new Error('User not found');

          await user.send(
            stringTemplate(messageParameters, {
              allowProtoPropertiesByDefault: true,
            }),
          );
          break;

        case SendMessageTo.CHANNEL:
          await this.discord.channels.fetch(to);
          const channel = this.discord.channels.cache.get(to);
          if (!channel) throw new Error('Guild channel not found');
          if (!channel.isTextBased())
            throw new Error('Guild channel is not a text channel');

          await channel.send(
            stringTemplate(messageParameters, {
              allowProtoPropertiesByDefault: true,
            }),
          );
          break;
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
