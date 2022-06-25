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
export class OpenAIUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, (guild) => guild.openAIUsage)
  guild: Guild;

  @RelationId((openAIUsage: OpenAIUsage) => openAIUsage.guild)
  guildId: number;

  @Column({ default: 0 })
  totalTokens: number;
}
