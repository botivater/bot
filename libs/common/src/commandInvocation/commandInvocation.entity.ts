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
import { GuildMember } from '../guildMember/guildMember.entity';

@Entity()
export class CommandInvocation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, (guild) => guild.commandInvocations, {
    onDelete: 'SET NULL',
  })
  guild: Guild;

  @RelationId((commandInvocation: CommandInvocation) => commandInvocation.guild)
  guildId: number;

  @ManyToOne(
    () => GuildMember,
    (guildMember) => guildMember.commandInvocations,
    { onDelete: 'SET NULL' },
  )
  guildMember: GuildMember;

  @RelationId(
    (commandInvocation: CommandInvocation) => commandInvocation.guildMember,
  )
  guildMemberId: number;

  @Column()
  commandName: string;
}
