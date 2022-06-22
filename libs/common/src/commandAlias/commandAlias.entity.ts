import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Guild } from '../guild/guild.entity';

@Entity()
export class CommandAlias {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, (guild) => guild.commandAliases)
  guild: Guild;

  @RelationId((commandAlias: CommandAlias) => commandAlias.guild)
  guildId: number;

  @Column()
  commandName: string;

  @Column()
  internalName: string;
}
