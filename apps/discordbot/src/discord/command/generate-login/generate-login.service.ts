import { Tenant } from '@common/common/tenant/tenant.entity';
import { User } from '@common/common/user/user.entity';
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import {
  CommandInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { In, Repository } from 'typeorm';
import { Command } from '../command';

@Injectable()
export class GenerateLoginService extends Command {
  private readonly logger = new Logger(GenerateLoginService.name);

  public COMMAND_NAME = 'generate-login';

  /**
   *
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  public setup(): SlashCommandBuilder {
    const firstNameOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('firstname')
        .setNameLocalization('nl', 'voornaam')
        .setDescription('First name of the user.')
        .setDescriptionLocalization('nl', 'De voornaam van de gebruiker.')
        .setRequired(true);

    const lastNameOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('lastname')
        .setNameLocalization('nl', 'achternaam')
        .setDescription('Last name of the user.')
        .setDescriptionLocalization('nl', 'De achternaam van de gebruiker.')
        .setRequired(true);

    const emailOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('email')
        .setNameLocalization('nl', 'email')
        .setDescription('Email address of the user.')
        .setDescriptionLocalization('nl', 'De email van de gebruiker.')
        .setRequired(true);

    const passwordOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('password')
        .setNameLocalization('nl', 'wachtwoord')
        .setDescription('Password of the user.')
        .setDescriptionLocalization('nl', 'Het wachtwoord van de gebruiker.')
        .setRequired(true);

    return new SlashCommandBuilder()
      .setName('generate-login')
      .setNameLocalization('nl', 'genereer-login')
      .setDescription('Create a new login.')
      .setDescriptionLocalization('nl', 'Maak een nieuwe login aan.')
      .addStringOption(firstNameOption)
      .addStringOption(lastNameOption)
      .addStringOption(emailOption)
      .addStringOption(passwordOption)
      .setDefaultPermission(false);
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({
      ephemeral: true,
    });

    try {
      const firstName = interaction.options.getString('firstname');
      if (!firstName) throw new Error('First name is required.');

      const lastName = interaction.options.getString('lastname');
      if (!lastName) throw new Error('Last name is required.');

      const email = interaction.options.getString('email');
      if (!email) throw new Error('Email is required.');

      const password = interaction.options.getString('password');
      if (!password) throw new Error('Password is required.');

      const user = await this.userRepository.findOneBy({ email });
      if (user) throw new Error('User with that email address already exists.');

      const tenant = await this.tenantRepository.findOneByOrFail({
        guilds: { snowflake: In([interaction.guildId]) },
      });

      const newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.password = await hash(password, 12);
      newUser.tenants = [tenant];
      await this.userRepository.save(newUser);

      await interaction.editReply(
        `Login created successfully. You can now login to the bot admin panel available on: ${this.configService.get(
          'BOT_ADMIN_PANEL_URL',
        )}`,
      );
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('Something went wrong.');
    }
  }
}
