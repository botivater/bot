export enum CommandFlowGroupType {
  NONE,
  REACTION,
}

export enum OnType {
  NONE,
  REACTION_ADD,
  REACTION_REMOVE,
}

export enum BuildingBlockType {
  NONE = 0,
  SEND_MESSAGE = 1,
  ADD_ROLE = 2,
  REMOVE_ROLE = 3,
}

export enum CheckType {
  NONE,
  REACTION_EMOJI,
}

export type CreateCommandFlowDto = {
  onType: OnType;
  buildingBlockType: BuildingBlockType;
  options: any;
  order: number;
  checkType?: CheckType;
  checkValue?: any;
};

export class CreateCommandFlowGroupDto {
  type: CommandFlowGroupType;
  guildId: number;
  channelSnowflake: string;
  name: string;
  description: string;
  messageText: string;
  reactions: string[];
  commandFlows: CreateCommandFlowDto[];
}
