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
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => GuildMember, (guildMember) => guildMember.submittedReports, {
    onDelete: 'SET NULL',
  })
  guildMember: GuildMember;

  @RelationId((report: Report) => report.guildMember)
  guildMemberId: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  channelId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => GuildMember, (guildMember) => guildMember.reports, {
    onDelete: 'SET NULL',
  })
  reportedGuildMember: GuildMember;

  @RelationId((report: Report) => report.reportedGuildMember)
  reportedGuildMemberId: number;

  @Column({ default: true })
  anonymous: boolean;

  @Column({ default: false })
  resolved: boolean;

  @ManyToOne(() => Guild, (guild) => guild.reports)
  guild: Guild;

  @RelationId((report: Report) => report.guild)
  guildId: number;
}
