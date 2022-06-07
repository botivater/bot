import { REST } from '@discordjs/rest';
import {
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CacheType,
  CommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { Discord } from '../discord';
import { Command } from './command.interface';
import { PingCommandService } from './ping-command/ping-command.service';
import { Repository } from 'typeorm';
import { CommandList } from '@common/common/commandList/commandList.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DevCommandService } from './dev-command/dev-command.service';
import { ToneIndicatorCommandService } from './tone-indicator-command/tone-indicator-command.service';
import { FindAFriendCommandService } from './find-a-friend-command/find-a-friend-command.service';
import { HelpCommandService } from './help-command/help-command.service';
import { SetBirthdayCommandService } from './set-birthday-command/set-birthday-command.service';
import { RecreateFlowsCommandService } from './recreate-flows-command/recreate-flows-command.service';
import { ReportCommandService } from './report-command/report-command.service';
import { LogUsageService } from '../log-usage/log-usage.service';
import { Guild } from '@common/common/guild/guild.entity';

type Map<T> = {
  [index: string]: (interaction: T) => Promise<void> | void;
};

@Injectable()
export class CommandService {
  private readonly logger = new Logger(CommandService.name);
  private commandMap: Map<CommandInteraction<CacheType>> = {};
  private modalSubmitMap: Map<ModalSubmitInteraction<CacheType>> = {};
  private restCommandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];
  private readonly rest: REST;

  /**
   *
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly discord: Discord,
    @InjectRepository(CommandList)
    private commandListRepository: Repository<CommandList>,
    private readonly pingCommandService: PingCommandService,
    private readonly devCommandService: DevCommandService,
    private readonly toneIndicatorCommandService: ToneIndicatorCommandService,
    private readonly findAFriendCommandService: FindAFriendCommandService,
    private readonly helpCommandService: HelpCommandService,
    private readonly setBirthdayCommandService: SetBirthdayCommandService,
    private readonly recreateFlowsCommandService: RecreateFlowsCommandService,
    private readonly reportCommandService: ReportCommandService,
    private readonly logUsageService: LogUsageService,
  ) {
    this.rest = new REST({ version: '9' }).setToken(
      this.configService.getOrThrow('BOT_TOKEN'),
    );

    this.register(this.pingCommandService);
    this.register(this.devCommandService);
    this.register(this.toneIndicatorCommandService);
    this.register(this.findAFriendCommandService);
    this.register(this.helpCommandService);
    this.register(this.setBirthdayCommandService);
    this.register(this.recreateFlowsCommandService);
    this.register(this.reportCommandService);
  }

  public async register(command: Command) {
    const slashCommand = command.setup();
    this.restCommandArray.push(slashCommand.toJSON());
    this.commandMap[slashCommand.name] = command.handleCommand.bind(command);
    this.modalSubmitMap[slashCommand.name] =
      command.handleModalSubmit.bind(command);
  }

  public async putGuildsCommands(guilds: Guild[]) {
    await Promise.all(guilds.map((guild) => this.putGuildCommands(guild)));
  }

  public async putGuildCommands(guild: Guild) {
    const restCommandArrayCopy = [...this.restCommandArray];

    const commandLists = await this.commandListRepository.findBy({
      guild: {
        id: guild.id,
      },
    });

    for (const commandList of commandLists) {
      const command = new SlashCommandBuilder()
        .setName(commandList.name)
        .setDescription(commandList.description)
        .setDefaultPermission(true);

      restCommandArrayCopy.push(command.toJSON());
    }

    await this.rest.put(
      Routes.applicationGuildCommands(
        this.configService.getOrThrow('APPLICATION_ID'),
        guild.snowflake,
      ),
      {
        body: restCommandArrayCopy,
      },
    );
  }

  public async executeCommand(interaction: CommandInteraction<CacheType>) {
    try {
      const { guild, commandName } = interaction;

      this.logger.debug(`Handling command: ${commandName}`);

      this.logUsageService.logInteraction(interaction);

      // Firstly check all of the static commands, they must always be the first in order.
      if (this.commandMap.hasOwnProperty(commandName)) {
        this.commandMap[commandName](interaction);
        return;
      }

      // Next, check the database flows.
      const dbCommandList = await this.commandListRepository.findOneBy({
        guild: {
          snowflake: guild.id,
        },
        name: commandName,
      });

      if (dbCommandList) {
        await interaction.deferReply();

        try {
          if (!dbCommandList.options || dbCommandList.options.length === 0)
            throw new Error('No options found in command list');

          const randomText =
            dbCommandList.options[
              Math.round(Math.random() * (dbCommandList.options.length - 1))
            ];

          await interaction.editReply(randomText);
        } catch (err) {
          this.logger.error(err);
          await interaction.editReply('An error has occurred!');
        }

        return;
      }

      throw new Error(
        `Invalid command: ${commandName} executed in guild ${guild.name}`,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  public async executeModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ) {
    try {
      const { guild, customId } = interaction;

      this.logger.debug(`Handling modal submit: ${customId}`);

      // Firstly check all of the static commands, they must always be the first in order.
      if (this.modalSubmitMap.hasOwnProperty(customId)) {
        this.modalSubmitMap[customId](interaction);
        return;
      }

      throw new Error(
        `Invalid modal submit: ${customId} executed in guild ${guild.name}`,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
