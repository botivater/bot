import { Injectable, Logger } from '@nestjs/common';
import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { Discord } from '../../discord';
import {
  MessageReactionEventService,
  OnType,
} from '../message-reaction-event/message-reaction-event.service';

@Injectable()
export class MessageReactionAddEventService {
  private readonly logger = new Logger(MessageReactionAddEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    private readonly messageReactionEventService: MessageReactionEventService,
  ) {
    this.discord.on('messageReactionAdd', this.handle.bind(this));
  }

  public async handle(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    try {
      this.messageReactionEventService.handle(
        reaction,
        user,
        OnType.REACTION_ADD,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
