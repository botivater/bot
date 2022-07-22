import { Injectable, Logger } from '@nestjs/common';
import { Discord } from '../../discord';
import discord, { GuildMember, InteractionType } from 'discord.js';
import { CommandService } from '../../command/command.service';
import { SyncProvider } from '../../sync-provider';

@Injectable()
export class InteractionCreateEventService {
  private readonly logger = new Logger(InteractionCreateEventService.name);

  /**
   *
   */
  constructor(
    private readonly discord: Discord,
    private readonly commandService: CommandService,
    private readonly syncProvider: SyncProvider,
  ) {
    this.discord.on('interactionCreate', this.handle.bind(this));
  }

  public async handle(interaction: discord.Interaction<discord.CacheType>) {
    if (interaction.user.bot) return;

    const { guild, member } = interaction;

    const dbGuild = await this.syncProvider.guild(guild);
    if (member instanceof GuildMember) {
      const dbGuildMember = await this.syncProvider.guildMember(
        dbGuild,
        member,
      );
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      this.commandService.executeCommand(interaction);
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      this.commandService.executeModalSubmit(interaction);
    }
  }
}
