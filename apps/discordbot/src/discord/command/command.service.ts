import { REST } from '@discordjs/rest';
import {
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApplicationCommandType,
  CacheType,
  CommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { Discord } from '../discord';
import { Command } from './command';
import { PingCommandService } from './ping-command/ping-command.service';
import { Repository } from 'typeorm';
import { CommandList } from '@common/common/commandList/commandList.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DevCommandService } from './dev-command/dev-command.service';
import { ToneIndicatorCommandService } from './tone-indicator-command/tone-indicator-command.service';
import { FindAFriendCommandService } from './find-a-friend-command/find-a-friend-command.service';
import { HelpCommandService } from './help-command/help-command.service';
import { SetBirthdayCommandService } from './set-birthday-command/set-birthday-command.service';
import { ReportCommandService } from './report-command/report-command.service';
import { GenerateLoginService } from './generate-login/generate-login.service';
import { CoupleLoginService } from './couple-login/couple-login.service';
import { LogUsageService } from '../log-usage/log-usage.service';
import { Guild } from '@common/common/guild/guild.entity';
import { QAndAService } from './q-and-a/q-and-a.service';
import { AskAiService } from './ask-ai/ask-ai.service';
import { CommandAlias } from '@common/common/commandAlias/commandAlias.entity';
import { ChatAiReplyService } from './chat-ai-reply/chat-ai-reply.service';
import { AskAnonymouslyCommandService } from './ask-anonymously-command/ask-anonymously-command.service';

@Injectable()
export class CommandService {
  private readonly logger = new Logger(CommandService.name);
  private readonly rest: REST;
  private readonly commandArray: Command[] = [];

  /**
   *
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly discord: Discord,
    @InjectRepository(CommandAlias)
    private commandAliasRepository: Repository<CommandAlias>,
    @InjectRepository(CommandList)
    private commandListRepository: Repository<CommandList>,
    private readonly pingCommandService: PingCommandService,
    private readonly devCommandService: DevCommandService,
    private readonly toneIndicatorCommandService: ToneIndicatorCommandService,
    private readonly findAFriendCommandService: FindAFriendCommandService,
    private readonly helpCommandService: HelpCommandService,
    private readonly setBirthdayCommandService: SetBirthdayCommandService,
    private readonly reportCommandService: ReportCommandService,
    private readonly generateLoginService: GenerateLoginService,
    private readonly coupleLoginService: CoupleLoginService,
    private readonly qAndAService: QAndAService,
    private readonly askAiService: AskAiService,
    private readonly chatAiReplyService: ChatAiReplyService,
    private readonly askAnonymouslyCommandService: AskAnonymouslyCommandService,
    private readonly logUsageService: LogUsageService,
  ) {
    this.rest = new REST({ version: '9' }).setToken(
      this.configService.getOrThrow('BOT_TOKEN'),
    );

    this.commandArray.push(this.pingCommandService);
    this.commandArray.push(this.devCommandService);
    this.commandArray.push(this.toneIndicatorCommandService);
    this.commandArray.push(this.findAFriendCommandService);
    this.commandArray.push(this.helpCommandService);
    this.commandArray.push(this.setBirthdayCommandService);
    this.commandArray.push(this.reportCommandService);
    this.commandArray.push(this.generateLoginService);
    this.commandArray.push(this.coupleLoginService);
    this.commandArray.push(this.qAndAService);
    this.commandArray.push(this.askAiService);
    this.commandArray.push(this.chatAiReplyService);
    this.commandArray.push(this.askAnonymouslyCommandService);
  }

  public async putGuildsCommands(guilds: Guild[]) {
    await Promise.all(guilds.map((guild) => this.putGuildCommands(guild)));
  }

  public async putGuildCommands(guild: Guild) {
    const restCommandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];

    const commandAliases = await this.commandAliasRepository.findBy({
      guild: {
        id: guild.id,
      },
    });

    for (const commandAlias of commandAliases) {
      const command = this.commandArray.find(
        (command) => command.COMMAND_NAME === commandAlias.internalName,
      );

      if (command) {
        const setupCommand = command.setup();
        setupCommand.setName(commandAlias.commandName);
        setupCommand.setNameLocalization('nl', commandAlias.commandName);

        restCommandArray.push(setupCommand.toJSON());
      }
    }

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

      restCommandArray.push(command.toJSON());
    }

    await this.rest.put(
      Routes.applicationGuildCommands(
        this.configService.getOrThrow('APPLICATION_ID'),
        guild.snowflake,
      ),
      {
        body: restCommandArray,
      },
    );
  }

  public async executeCommand(interaction: CommandInteraction<CacheType>) {
    try {
      if (interaction.commandType !== ApplicationCommandType.ChatInput) return;

      const { guild, commandName } = interaction;

      this.logger.debug(`Handling command: ${commandName}`);

      this.logUsageService.logInteraction(interaction);

      // Firstly check all of the static commands, they must always be the first in order.
      const dbCommandAlias = await this.commandAliasRepository.findOneBy({
        guild: {
          snowflake: guild.id,
        },
        commandName,
      });

      if (dbCommandAlias) {
        const command = this.commandArray.find(
          (command) => command.COMMAND_NAME === dbCommandAlias.internalName,
        );

        if (command) {
          await command.handleCommand(interaction);
          return;
        }
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

      if (customId) {
        const command = this.commandArray.find(
          (command) => command.COMMAND_NAME === customId,
        );

        if (command) {
          await command.handleModalSubmit(interaction);
          return;
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
