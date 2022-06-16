import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GuildChannel } from '../guildChannel/guildChannel.entity';
import { GuildMember } from '../guildMember/guildMember.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 64, unique: true })
  snowflake: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isRemovedOnDiscord: boolean;

  @ManyToOne(() => GuildChannel, (guildChannel) => guildChannel.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  guildChannel: GuildChannel;

  @ManyToOne(() => GuildMember, (guildMember) => guildMember.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  guildMember: GuildMember;
}
