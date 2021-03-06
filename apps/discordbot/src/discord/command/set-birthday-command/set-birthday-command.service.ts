import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommandInteraction,
  CacheType,
  InteractionType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Repository } from 'typeorm';
import { Command } from '../command';

@Injectable()
export class SetBirthdayCommandService extends Command {
  private readonly logger = new Logger(SetBirthdayCommandService.name);

  public COMMAND_NAME = 'set-birthday';

  /**
   *
   */
  constructor(
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
  ) {
    super();
  }

  public setup(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('set-birthday')
      .setNameLocalization('nl', 'verjaardag-instellen')
      .setDescription(
        'Geef je verjaardag door aan de bot voor een leuke melding op je verjaardag!',
      )
      .setDefaultPermission(true)
      .addIntegerOption((input) =>
        input
          .setName('year')
          .setNameLocalization('nl', 'jaar')
          .setDescription('Your birth year')
          .setDescriptionLocalization('nl', 'Jouw geboorte jaar')
          .setRequired(true),
      )
      .addIntegerOption((input) =>
        input
          .setName('month')
          .setNameLocalization('nl', 'maand')
          .setDescription('Your birth month')
          .setDescriptionLocalization('nl', 'Jouw geboorte maand')
          .setRequired(true)
          .setChoices(
            {
              name: 'January',
              name_localizations: { nl: 'Januari' },
              value: 1,
            },
            {
              name: 'February',
              name_localizations: { nl: 'Februari' },
              value: 2,
            },
            {
              name: 'March',
              name_localizations: { nl: 'Maart' },
              value: 3,
            },
            {
              name: 'April',
              name_localizations: { nl: 'April' },
              value: 4,
            },
            {
              name: 'May',
              name_localizations: { nl: 'Mei' },
              value: 5,
            },
            {
              name: 'June',
              name_localizations: { nl: 'Juni' },
              value: 6,
            },
            {
              name: 'July',
              name_localizations: { nl: 'Juli' },
              value: 7,
            },
            {
              name: 'August',
              name_localizations: { nl: 'Augustus' },
              value: 8,
            },
            {
              name: 'September',
              name_localizations: { nl: 'September' },
              value: 9,
            },
            {
              name: 'October',
              name_localizations: { nl: 'Oktober' },
              value: 10,
            },
            {
              name: 'November',
              name_localizations: { nl: 'November' },
              value: 11,
            },
            {
              name: 'December',
              name_localizations: { nl: 'December' },
              value: 12,
            },
          ),
      )
      .addIntegerOption((input) =>
        input
          .setName('day')
          .setNameLocalization('nl', 'dag')
          .setDescription('Your birth day')
          .setDescriptionLocalization('nl', 'Jouw geboorte dag')
          .setRequired(true),
      );
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const year = interaction.options.getInteger('year');
      const month = interaction.options.getInteger('month');
      const day = interaction.options.getInteger('day');

      const date = new Date(year, month - 1, day);
      this.logger.debug(`Parsed date as ${date.toDateString()}`);

      const dbGuildMember = await this.guildMemberRepository.findOneBy({
        snowflake: interaction.member.user.id,
        guild: {
          snowflake: interaction.guild.id,
        },
      });
      if (!dbGuildMember) throw new Error('Guild member not found');

      await this.guildMemberRepository.update(dbGuildMember.id, {
        birthday: date,
      });

      let content = '';
      content += 'Ik heb jouw verjaardag opgeslagen.';
      content += `\nJouw verjaardag is op ${date.toLocaleDateString('nl-NL', {
        dateStyle: 'long',
      })}.`;

      await interaction.editReply(content);
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('An error occurred.');
    }
  }
}
