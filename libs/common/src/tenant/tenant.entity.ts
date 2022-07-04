import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { EmailConfig } from '../emailConfig/emailConfig.entity';
import { Guild } from '../guild/guild.entity';
import { User } from '../user/user.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.tenants)
  @JoinTable()
  users: User[];

  @OneToMany(() => Guild, (guild) => guild.tenant)
  guilds: Guild[];

  @OneToOne(() => EmailConfig, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  emailConfig: EmailConfig;

  @RelationId((tenant: Tenant) => tenant.emailConfig)
  emailConfigId?: number;
}
