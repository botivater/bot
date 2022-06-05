import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Guild } from '../guild/guild.entity';

@Entity()
export class GuildConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Guild, (guild) => guild.guildConfig, {
    nullable: false,
  })
  guild: Guild;

  @Column({ type: 'varchar', length: 64, nullable: false })
  systemChannelId: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  announcementChannelId: string;

  @Column({ default: false })
  pronounCheckEnabled: boolean;

  @Column({ default: false })
  welcomeMessageEnabled: boolean;

  @Column({ type: 'simple-json', nullable: true })
  welcomeMessageConfig: { channelSnowflake: string; format: string };

  @Column({ default: false })
  inactivityCheckEnabled: boolean;

  @Column({ type: 'simple-json', nullable: true })
  inactivityCheckConfig: {
    inactiveRoleId: string;
    activeRoleId: string;
    inactiveUserSeconds: number;
  };
}
