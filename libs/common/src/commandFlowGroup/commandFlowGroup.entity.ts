import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { CommandFlow } from '../commandFlow/commandFlow.entity';
import { Guild } from '../guild/guild.entity';

@Entity()
export class CommandFlowGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, (guild) => guild.commandFlowGroups, {
    onDelete: 'CASCADE',
  })
  guild: Guild;

  @RelationId((commandFlowGroup: CommandFlowGroup) => commandFlowGroup.guild)
  guildId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'tinyint' })
  type: number;

  @Column({ type: 'varchar', length: 64 })
  messageId: string;

  @Column({ type: 'varchar', length: 64 })
  channelId: string;

  @Column({ type: 'text' })
  messageText: string;

  @Column({ type: 'simple-json' })
  reactions: string[];

  @OneToMany(() => CommandFlow, (commandFlow) => commandFlow.commandFlowGroup)
  commandFlows: CommandFlow[];
}
