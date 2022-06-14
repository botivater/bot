import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { Repository } from 'typeorm';
import { ActivityProvider } from '../../activity-provider';
import { AddRoleBuildingBlockService } from '../../building-block/add-role-building-block/add-role-building-block.service';
import { RemoveRoleBuildingBlockService } from '../../building-block/remove-role-building-block/remove-role-building-block.service';
import {
  SendMessageBuildingBlockService,
  SendMessageTo,
} from '../../building-block/send-message-building-block/send-message-building-block.service';
import { Discord } from '../../discord';

export enum OnType {
  NONE,
  REACTION_ADD,
  REACTION_REMOVE,
}

export enum CommandFlowGroupType {
  NONE,
  REACTION,
}

export enum CheckType {
  NONE,
  REACTION_EMOJI,
}

export enum BuildingBlockType {
  NONE = 0,
  SEND_MESSAGE = 1,
  ADD_ROLE = 2,
  REMOVE_ROLE = 3,
}

@Injectable()
export class MessageReactionEventService {
  private readonly logger = new Logger(MessageReactionEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    private readonly activityProvider: ActivityProvider,
    @InjectRepository(CommandFlowGroup)
    private commandFlowGroupRepository: Repository<CommandFlowGroup>,
    private readonly addRoleBuildingBlockService: AddRoleBuildingBlockService,
    private readonly removeRoleBuildingBlockService: RemoveRoleBuildingBlockService,
    private readonly sendMessageBuildingBlockService: SendMessageBuildingBlockService,
  ) {}

  public async handle(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    onType: OnType = OnType.NONE,
  ) {
    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();
      if (user.partial) await user.fetch();

      if (user.bot) return;

      this.logger.debug(
        `Processing reaction with emoji: ${reaction.emoji.name}`,
      );

      // Try registering the activity using the ActivityProvider.
      try {
        await this.activityProvider.register({
          guildSnowflake: reaction.message.guildId,
          guildMemberSnowflake: user.id,
          timestamp: new Date(),
        });
      } catch (err) {
        this.logger.error(err);
      }

      // Get the guild this reaction was sent in.
      const guild = this.discord.guilds.cache.get(reaction.message.guildId);
      if (!guild) throw new Error('Guild not found');

      // Get the member of the guild that sent this reaction.
      const guildMember = guild.members.cache.get(user.id);
      if (!guildMember) throw new Error('Guild member not found');

      this.logger.debug(
        `Searching database for flows with parameters: messageId: ${reaction.message.id}, onType: ${onType}`,
      );

      const commandFlowGroup = await this.commandFlowGroupRepository.findOne({
        where: {
          guild: {
            snowflake: guild.id,
          },
          messageId: reaction.message.id,
          type: CommandFlowGroupType.REACTION,
          commandFlows: {
            onType,
          },
        },
        relations: {
          commandFlows: true,
        },
        order: {
          commandFlows: {
            order: 'ASC',
          },
        },
      });
      if (!commandFlowGroup) return;
      if (commandFlowGroup.commandFlows.length === 0) return;

      const { commandFlows } = commandFlowGroup;

      // Handle the list of actions.
      for (const commandFlow of commandFlows) {
        this.logger.debug(
          `Handling command flow part ${commandFlow.order} of flow for message ${commandFlowGroup.messageId}.`,
        );

        if (commandFlow.onType !== onType) continue;

        // Check if the flow should be executed.
        if (commandFlow.checkType !== CheckType.NONE) {
          if (
            commandFlow.checkType === CheckType.REACTION_EMOJI &&
            commandFlow.checkValue !== reaction.emoji.name
          )
            continue;
        }

        this.logger.debug(
          `Executing command flow part ${commandFlow.order} of flow for message ${commandFlowGroup.messageId}.`,
        );

        // Do nothing.
        if (commandFlow.buildingBlockType === BuildingBlockType.NONE) {
          // Do nothing;
          continue;
        }

        // Send a message.
        if (commandFlow.buildingBlockType === BuildingBlockType.SEND_MESSAGE) {
          const { toType, to, messageFormat } = <any>commandFlow.options;

          const options = {
            toType,
            to,
            messageFormat,
            messageParameters: {
              guild,
              guildMember,
              user,
              reaction,
            },
          };

          if (options.toType === SendMessageTo.SENDER) {
            options.to = user.id;
          }

          await this.sendMessageBuildingBlockService.handle(options);
          continue;
        }

        // Add a role
        if (commandFlow.buildingBlockType === BuildingBlockType.ADD_ROLE) {
          const { roleId } = <any>commandFlow.options;

          await this.addRoleBuildingBlockService.handle({
            guildSnowflake: guild.id,
            guildMemberSnowflake: guildMember.id,
            roleSnowflake: roleId,
          });

          continue;
        }

        // Remove a role
        if (commandFlow.buildingBlockType === BuildingBlockType.REMOVE_ROLE) {
          const { roleId } = <any>commandFlow.options;

          await this.removeRoleBuildingBlockService.handle({
            guildSnowflake: guild.id,
            guildMemberSnowflake: guildMember.id,
            roleSnowflake: roleId,
          });

          continue;
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
