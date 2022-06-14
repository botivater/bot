import { CommandFlow } from '@common/common/commandFlow/commandFlow.entity';
import { CommandFlowGroup } from '@common/common/commandFlowGroup/commandFlowGroup.entity';
import { Guild } from '@common/common/guild/guild.entity';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageWithReactionResponse } from 'apps/discordbot/src/discord/bot/interface/create-message-with-reaction-response.interface';
import { Request } from 'express';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ApiService } from '../api.service';
import { CreateCommandFlowGroupDto } from './dto/create-command-flow-group.dto';
import { UpdateCommandFlowGroupDto } from './dto/update-command-flow-group.dto';

@Injectable({ scope: Scope.REQUEST })
export class CommandFlowGroupService {
  private readonly logger = new Logger(CommandFlowGroupService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
    @InjectRepository(CommandFlow)
    private readonly commandFlowRepository: Repository<CommandFlow>,
    @InjectRepository(CommandFlowGroup)
    private readonly commandFlowGroupRepository: Repository<CommandFlowGroup>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly apiService: ApiService,
  ) {}

  async create(createCommandFlowGroupDto: CreateCommandFlowGroupDto) {
    console.log(createCommandFlowGroupDto);
    const {
      type,
      guildId,
      channelSnowflake,
      name,
      description,
      messageText,
      reactions,
      commandFlows,
    } = createCommandFlowGroupDto;

    const guild = await this.guildRepository.findOneByOrFail({ id: guildId });

    const { messageSnowflake } =
      await new Promise<CreateMessageWithReactionResponse>((resolve) => {
        this.apiService
          .createMessageWithReaction({
            channelSnowflake,
            message: messageText,
            reactions,
          })
          .subscribe((response) => {
            resolve(response);
          });
      });

    let commandFlowGroup = this.commandFlowGroupRepository.create({
      guild,
      name,
      description,
      type,
      messageId: messageSnowflake,
      channelId: channelSnowflake,
      messageText,
      reactions,
    });
    commandFlowGroup = await this.commandFlowGroupRepository.save(
      commandFlowGroup,
    );

    for (const commandFlowDto of commandFlows) {
      const {
        onType,
        buildingBlockType,
        options,
        order,
        checkType,
        checkValue,
      } = commandFlowDto;

      const commandFlow = this.commandFlowRepository.create({
        commandFlowGroup,
        onType,
        buildingBlockType,
        options,
        order,
        checkType,
        checkValue,
      });
      await this.commandFlowRepository.save(commandFlow);
    }

    return;
  }

  async findAll(options?: FindManyOptions<CommandFlowGroup>) {
    return await this.commandFlowGroupRepository.find(options);
  }

  async findOne(options: FindOneOptions<CommandFlowGroup>) {
    return await this.commandFlowGroupRepository.findOne(options);
  }

  async update(
    id: number,
    updateCommandFlowGroupDto: UpdateCommandFlowGroupDto,
  ) {
    const commandFlowGroup = await this.commandFlowGroupRepository.findOneBy({
      id,
    });
    this.commandFlowGroupRepository.merge(
      commandFlowGroup,
      updateCommandFlowGroupDto,
    );
    return await this.commandFlowGroupRepository.save(commandFlowGroup);
  }

  async remove(id: number) {
    return await this.commandFlowGroupRepository.delete({ id });
  }
}
