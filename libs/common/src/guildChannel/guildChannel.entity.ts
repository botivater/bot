import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Guild } from '../guild/guild.entity';
import { Message } from '../message/message.entity';

@Entity()
@Unique('snowflake_guild', ['snowflake', 'guild'])
export class GuildChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 64 })
  snowflake: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => Guild, (guild) => guild.guildChannels, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  guild: Guild;

  @RelationId((guildChannel: GuildChannel) => guildChannel.guild)
  guildId: number;

  @OneToMany(() => Message, (message) => message.guildChannel, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
