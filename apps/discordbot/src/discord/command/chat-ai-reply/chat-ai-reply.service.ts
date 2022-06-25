import { Guild } from '@common/common/guild/guild.entity';
import { GuildConfig } from '@common/common/guildConfig/guildConfig.entity';
import { OpenAIUsageInterface } from '@common/common/openai/open-ai-usage.interface';
import { OpenAIUsage } from '@common/common/openAIUsage/openAIUsage.entity';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { CacheType, CommandInteraction } from 'discord.js';
import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';
import { Repository } from 'typeorm';
import { AskAiService } from '../ask-ai/ask-ai.service';
import { Command } from '../command';

@Injectable()
export class ChatAiReplyService extends Command {
  private readonly logger = new Logger(AskAiService.name);
  private readonly configuration: Configuration;
  private readonly openAiApi: OpenAIApi;

  public COMMAND_NAME = 'chat-ai-reply';

  /**
   *
   */
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(GuildConfig)
    private readonly guildConfigRepository: Repository<GuildConfig>,
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
    @InjectRepository(OpenAIUsage)
    private readonly openAIUsageRepository: Repository<OpenAIUsage>,
  ) {
    super();
    this.configuration = new Configuration({
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY'),
    });

    this.openAiApi = new OpenAIApi(this.configuration);
  }

  public setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('chat-ai-reply')
      .setNameLocalization('nl', 'chat-ai-antwoord')
      .setDescription('Reply to the chat')
      .setDescriptionLocalization('nl', 'Antwoord op de chat')
      .setDefaultPermission(false);
  }

  public async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    try {
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

      await interaction.guild.fetch();
      const self = await interaction.guild.members.fetch(
        interaction.client.user.id,
      );

      await interaction.channel.fetch();
      const guildChannel = interaction.channel;
      await guildChannel.messages.fetch();
      const lastMessages = guildChannel.messages.cache
        .sort((a, b) => {
          return a.createdTimestamp - b.createdTimestamp;
        })
        .last(10);

      const lastMessageInput = lastMessages.map(
        (m) => `${m.member.displayName}: ${m.content}`,
      );

      const inputString = `${lastMessageInput.join('\n')}`;

      const response = <
        AxiosResponse<CreateCompletionResponse & OpenAIUsageInterface, any>
      >await this.openAiApi.createCompletion({
        model: 'text-curie-001',
        prompt: inputString,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.7,
        presence_penalty: 0.0,
        stop: [`${self.displayName}:`],
      });

      if (response.data.usage) {
        const guild = await this.guildRepository.findOneBy({
          snowflake: interaction.guildId,
        });

        const openAIUsage = this.openAIUsageRepository.create({
          totalTokens: response.data.usage.total_tokens || 0,
        });
        openAIUsage.guild = guild;

        await this.openAIUsageRepository.save(openAIUsage);
      }

      if (response.data.choices.length > 0) {
        await interaction.editReply({
          content: `${response.data.choices[0].text}`,
        });
      } else {
        await interaction.editReply({
          content: `That didn't work.`,
        });
      }
    } catch (err) {
      this.logger.error(err);

      if (err instanceof Error) {
        await interaction.editReply(err.message);
      }
    }
  }
}
