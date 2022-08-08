import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../command';

export enum HelpCommandEnum {
  REPORT = 'report',
  VERJAARDAG_INSTELLEN = 'verjaardag-instellen',
}

@Injectable()
export class HelpCommandService extends Command {
  private readonly logger = new Logger(HelpCommandService.name);

  public COMMAND_NAME = 'help';

  public setup(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('help')
      .setDescription(
        'Krijg hulp en info over het gebruiken van een bepaald commando.',
      )
      .setDefaultPermission(true)
      .addStringOption((option) =>
        option
          .setName('command')
          .setDescription('Het commando waar je hulp bij nodig hebt.')
          .setRequired(true)
          .addChoices(
            { name: '/report', value: HelpCommandEnum.REPORT },
            {
              name: '/verjaardag-instellen',
              value: HelpCommandEnum.VERJAARDAG_INSTELLEN,
            },
          ),
      );
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const command = interaction.options.getString('command');

      let content = '';

      switch (command) {
        case HelpCommandEnum.REPORT:
          content += `Het /report commando kan je gebruiken om iemand van het Mod-team te laten kijken naar een situatie waarin iemand zich niet aan de groepsregels houdt of zich slecht gedraagt.`;
          content += `\nHier heb je een video die je laat zien hoe je het gebruikt: https://youtu.be/htYE3np_czE`;
          break;

        case HelpCommandEnum.VERJAARDAG_INSTELLEN:
          content += `Het /verjaardag-instellen commando kan je gebruiken om je verjaardag in te stellen. Mira zal je dan op je verjaardag om 12:00 feliciteren!`;
          content += `\nHier heb je een video die je laat zien hoe je het gebruikt: https://youtu.be/YX02ePTscaM`;
          break;
      }

      await interaction.editReply({
        content,
      });
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('An error has occurred.');
    }
  }
}
