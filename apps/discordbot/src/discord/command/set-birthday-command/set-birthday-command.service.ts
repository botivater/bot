import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Repository } from 'typeorm';
import { Command } from '../command.interface';

@Injectable()
export class SetBirthdayCommandService implements Command {
  private readonly logger = new Logger(SetBirthdayCommandService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
  ) {}

  setup(): SlashCommandBuilder {
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
              value: 0,
            },
            {
              name: 'February',
              name_localizations: { nl: 'Februari' },
              value: 1,
            },
            {
              name: 'March',
              name_localizations: { nl: 'Maart' },
              value: 2,
            },
            {
              name: 'April',
              name_localizations: { nl: 'April' },
              value: 3,
            },
            {
              name: 'May',
              name_localizations: { nl: 'Mei' },
              value: 4,
            },
            {
              name: 'June',
              name_localizations: { nl: 'Juni' },
              value: 5,
            },
            {
              name: 'July',
              name_localizations: { nl: 'Juli' },
              value: 6,
            },
            {
              name: 'August',
              name_localizations: { nl: 'Augustus' },
              value: 7,
            },
            {
              name: 'September',
              name_localizations: { nl: 'September' },
              value: 8,
            },
            {
              name: 'October',
              name_localizations: { nl: 'Oktober' },
              value: 9,
            },
            {
              name: 'November',
              name_localizations: { nl: 'November' },
              value: 10,
            },
            {
              name: 'December',
              name_localizations: { nl: 'December' },
              value: 11,
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

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const year = interaction.options.getInteger('year');
      const month = interaction.options.getInteger('month');
      const day = interaction.options.getInteger('day');

      const date = new Date(year, month, day);
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

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
