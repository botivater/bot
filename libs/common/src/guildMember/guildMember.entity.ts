import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CommandInvocation } from '../commandInvocation/commandInvocation.entity';
import { Guild } from '../guild/guild.entity';
import { Report } from '../report/report.entity';

@Entity()
@Unique('snowflake_guildId', ['snowflake', 'guild'])
export class GuildMember {
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
  identifier: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'datetime', default: () => 'NOW()', nullable: true })
  lastInteraction: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Guild, (guild) => guild.guildMembers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  guild: Guild;

  @OneToMany(
    () => CommandInvocation,
    (commandInvocation) => commandInvocation.guildMember,
  )
  commandInvocations: CommandInvocation[];

  @OneToMany(() => Report, (report) => report.guildMember)
  submittedReports: Report[];

  @OneToMany(() => Report, (report) => report.reportedGuildMember)
  reports: Report[];
}
