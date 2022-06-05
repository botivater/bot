import { SlashCommandBuilder } from '@discordjs/builders';
import { Injectable, Logger } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command } from '../command.interface';

@Injectable()
export class FindAFriendCommandService implements Command {
  private readonly logger = new Logger(FindAFriendCommandService.name);
  private readonly options = [
    'Ik kwam vandaag deze knapperd tegen!',
    'Ik zag zojuist dit beestje op Tinder. Zal ik links of rechts swipen?',
    'Zojuist was dit vriendje op bezoek.',
    'Dit is een foto van een van mijn beste vrienden.',
    'Heb je ooit een knapper huisdier dan deze gezien? Okay na mij dan, want ik ben natuurlijk de aller knapste!',
    "The cuteness, it's too much... I'm in love!",
    'Vorige week had ik een date met deze hotstuff!',
    'Dit is een van mijn vriendjes!',
    'Ik kwam laatst dit vriendje tegen, maar we zijn vergeten telefoonnummers uit te wisselen. Weten jullie wie het baasje is zodat we een playdate kunnen organiseren?',
    'Hier is een van mijn beste vrienden!',
    'Zojuist zag ik deze knapperd rondlopen! Was te verlegen om hallo te zeggen tho...',
    'Wie dit is? Mijn BFF natuurlijk!',
    '#vrienden #gezellig #bff #squadgoals',
  ];
  private readonly amount = 358;

  setup(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('vindeenvriendje')
      .setDescription('Laat de bot een vriendje tonen!')
      .setDefaultPermission(false);
  }

  async handleCommand(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.deferReply();

    try {
      if (!this.options || this.options.length === 0)
        throw new Error('No options found');

      const randomNumber = Math.round(Math.random() * (this.amount - 1));

      const randomText =
        this.options[Math.round(Math.random() * (this.options.length - 1))];

      await interaction.editReply({
        content: randomText,
        files: [
          `https://static.friendshipbubble.nl/mira/pets/${randomNumber}.jpg`,
        ],
      });
    } catch (err) {
      this.logger.error(err);
      await interaction.editReply('An error has occurred!');
    }
  }

  async handleModalSubmit(
    interaction: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
