import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
}
