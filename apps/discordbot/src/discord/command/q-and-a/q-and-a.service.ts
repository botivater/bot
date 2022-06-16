import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command } from '../command.interface';
import { Configuration, OpenAIApi } from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QAndAService implements Command {
  private readonly logger = new Logger(QAndAService.name);
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
      .setName('q-and-a')
      .setNameLocalization('nl', 'q-en-a')
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
        prompt: `
        I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".

        Q: What is human life expectancy in the United States?
        A: Human life expectancy in the United States is 78 years.

        Q: Who was president of the United States in 1955?
        A: Dwight D. Eisenhower was president of the United States in 1955.

        Q: Which party did he belong to?
        A: He belonged to the Republican Party.

        Q: What is the square root of banana?
        A: Unknown

        Q: How does a telescope work?
        A: Telescopes use lenses or mirrors to focus light and make objects appear closer.

        Q: Where were the 1992 Olympics held?
        A: The 1992 Olympics were held in Barcelona, Spain.

        Q: How many squigs are in a bonk?
        A: Unknown

        Q: ${question}\nA:`,
        temperature: 0,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ['\n'],
      });

      if (response.data.choices.length > 0) {
        await interaction.editReply({
          content: `Q: ${question}\nA: ${response.data.choices[0].text}`,
        });
      } else {
        await interaction.editReply({
          content: `Q: ${question}\nA: I don't know the answer...`,
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
