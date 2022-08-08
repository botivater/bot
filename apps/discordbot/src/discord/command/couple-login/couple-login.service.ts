import { Tenant } from '@common/common/tenant/tenant.entity';
import { User } from '@common/common/user/user.entity';
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
  ChatInputCommandInteraction,
} from 'discord.js';
import { Repository, In } from 'typeorm';
import { Command } from '../command';

@Injectable()
export class CoupleLoginService extends Command {
  private readonly logger = new Logger(CoupleLoginService.name);

  public COMMAND_NAME = 'couple-login';

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
    const emailOption = (builder: SlashCommandStringOption) =>
      builder
        .setName('email')
        .setNameLocalization('nl', 'email')
        .setDescription('Email address of the user.')
        .setDescriptionLocalization('nl', 'De email van de gebruiker.')
        .setRequired(true);

    return new SlashCommandBuilder()
      .setName('couple-login')
      .setNameLocalization('nl', 'koppel-login')
      .setDescription('Couple a login.')
      .setDescriptionLocalization('nl', 'Koppel een login.')
      .addStringOption(emailOption)
      .setDefaultPermission(false);
  }

  public async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply({
      ephemeral: true,
    });

    try {
      const email = interaction.options.getString('email');
      if (!email) throw new Error('Email is required.');

      const user = await this.userRepository.findOne({
        where: { email },
        relations: { tenants: true },
      });
      if (!user) throw new Error('User with that email was not found.');

      const tenant = await this.tenantRepository.findOneByOrFail({
        guilds: { snowflake: In([interaction.guildId]) },
      });

      user.tenants.push(tenant);
      await this.userRepository.save(user);

      await interaction.editReply(
        `Login coupled successfully. You can now access the guild in bot admin panel under the tenant switcher available on: ${this.configService.get(
          'BOT_ADMIN_PANEL_URL',
        )}`,
      );
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('Something went wrong.');
    }
  }
}
