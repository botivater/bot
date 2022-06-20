import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { Repository } from 'typeorm';
import { Command } from '../command.interface';

@Injectable()
export class AskAiService implements Command {
  private readonly logger = new Logger(AskAiService.name);
  private readonly configuration: Configuration;
  private readonly openAiApi: OpenAIApi;

  /**
   *
   */
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(GuildConfig)
    private readonly guildConfigRepository: Repository<GuildConfig>,
  ) {
    this.configuration = new Configuration({
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY'),
    });

    this.openAiApi = new OpenAIApi(this.configuration);
  }

  setup(): SlashCommandBuilder {
    const questionOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('question')
        .setNameLocalization('nl', 'vraag')
        .setDescription('The question to ask')
        .setDescriptionLocalization('nl', 'De vraag die je wilt stellen')
        .setRequired(true);

    return new SlashCommandBuilder()
      .setName('ask-ai')
      .setNameLocalization('nl', 'vraag-ai')
      .setDescription('Ask the bot a question')
      .setDescriptionLocalization('nl', 'Stel de bot een vraag')
      .addStringOption(questionOption)
      .setDefaultPermission(false);
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    try {
      const question = interaction.options.getString('question');
      if (!question) throw new Error('No question provided');

      const guildConfig = await this.guildConfigRepository.findOneOrFail({
        where: {
          guild: {
            snowflake: interaction.guildId,
          },
        },
      });
      if (!guildConfig.isOpenAIEnabled) {
        await interaction.editReply(
          `OpenAI is not enabled for this server at this time`,
        );
        return;
      }

      const response = await this.openAiApi.createCompletion({
        model: 'text-curie-001',
        prompt: `${question}\n\n`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      if (response.data.choices.length > 0) {
        await interaction.editReply({
          content: `Input: ${question}\nOutput: ${response.data.choices[0].text}`,
        });
      } else {
        await interaction.editReply({
          content: `That didn't work.`,
        });
      }
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply(err);
    }
  }

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}