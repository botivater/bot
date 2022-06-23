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
export class CommandList {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'simple-json' })
  options: string[];

  @ManyToOne(() => Guild, (guild) => guild.guildMembers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  guild: Guild;

  @RelationId((commandList: CommandList) => commandList.guild)
  guildId: number;
}
