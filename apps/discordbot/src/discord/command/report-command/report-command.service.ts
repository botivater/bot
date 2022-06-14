import { Guild } from '@common/common/guild/guild.entity';
import { GuildMember } from '@common/common/guildMember/guildMember.entity';
import { Report } from '@common/common/report/report.entity';
import {
  channelMention,
  roleMention,
  SlashCommandBuilder,
  userMention,
} from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Repository } from 'typeorm';
import { Discord } from '../../discord';
import { Command } from '../command.interface';

@Injectable()
export class ReportCommandService implements Command {
  private readonly logger = new Logger(ReportCommandService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Guild)
    private guildRepository: Repository<Guild>,
    @InjectRepository(GuildMember)
    private guildMemberRepository: Repository<GuildMember>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private readonly discord: Discord,
  ) {}

  setup(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('report')
      .setDescription(
        'Report unwanted behavior or anyone who is not following the rules.',
      )
      .setDescriptionLocalization(
        'nl',
        'Meld ongewenst gedrag of iemand die zich niet aan de regels houdt.',
      )
      .setDefaultPermission(true)
      .addStringOption((option) =>
        option
          .setName('description')
          .setNameLocalization('nl', 'omschrijving')
          .setDescription('Description of the problem.')
          .setDescriptionLocalization('nl', 'Omschrijving van het probleem.')
          .setRequired(false),
      )
      .addUserOption((option) =>
        option
          .setName('user')
          .setNameLocalization('nl', 'gebruiker')
          .setDescription('User that is at fault.')
          .setDescriptionLocalization('nl', 'Gebruiker die in fout is.')
          .setRequired(false),
      )
      .addBooleanOption((option) =>
        option
          .setName('anonymous')
          .setNameLocalization('nl', 'anoniem')
          .setDescription('Do you want to be anonymous? Enter in True.')
          .setDescriptionLocalization(
            'nl',
            'Wil je anoniem blijven? Vul dan True in.',
          )
          .setRequired(false),
      );
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const description = interaction.options.getString('description');
      const user = interaction.options.getUser('user');
      const anonymous = interaction.options.getBoolean('anonymous');
      const isAnonymous = anonymous === null ? false : anonymous;

      const dbGuildMemberSender = await this.guildMemberRepository.findOneBy({
        snowflake: interaction.member.user.id,
        guild: {
          snowflake: interaction.guild.id,
        },
      });
      if (!dbGuildMemberSender)
        throw new Error('Could not find sender guild member');

      let dbGuildMemberReported = undefined;
      if (user) {
        dbGuildMemberReported = await this.guildMemberRepository.findOneBy({
          snowflake: user.id,
          guild: {
            snowflake: interaction.guild.id,
          },
        });
        if (!dbGuildMemberReported)
          throw new Error('Could not find reported guild member');
      }

      const dbGuild = await this.guildRepository.findOne({
        where: {
          snowflake: interaction.guild.id,
        },
        relations: {
          guildConfig: true,
        },
      });

      this.reportRepository.insert({
        guildMember: dbGuildMemberSender,
        channelId: interaction.channel.id,
        description: description || undefined,
        reportedGuildMember: dbGuildMemberReported,
        anonymous: isAnonymous,
        guild: dbGuild,
      });

      const messageChannel = this.discord.channels.cache.get(
        dbGuild.guildConfig.systemChannelId,
      );
      if (!messageChannel) throw new Error('Message channel not found');
      if (!messageChannel.isText())
        throw new Error('Message channel not a text channel');

      let message = `**Er is een nieuwe report binnen gekomen!**`;
      message += `\nKanaal: ${channelMention(interaction.channelId)} (#${
        interaction.channel.name
      })`;

      if (!isAnonymous) {
        message += `\nRapporteur: ${userMention(interaction.user.id)} (${
          interaction.user.tag
        })`;
      }

      if (description) {
        message += `\nOmschrijving: ${description}`;
      }

      if (user) {
        message += `\nGebruiker in fout: ${userMention(user.id)} (${user.tag})`;
      }

      await messageChannel.send({
        content: message,
        allowedMentions: {
          parse: [],
        },
      });

      await interaction.editReply({
        content: `Bedankt voor jouw report, ik heb het Mod-team ingelicht! Alleen jij kan dit bericht zien.`,
      });
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('An error has occurred.');
    }
  }

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
