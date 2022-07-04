import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Guild } from '../guild/guild.entity';
import { Tenant } from '../tenant/tenant.entity';

export enum FeatureType {
  NONE = 'none',

  // Extra modules
  LYMEVERENIGING_MEMBER_CHECKER = 'lymevereniging-member-checker',
}

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.features, {
    nullable: false,
  })
  tenant: Tenant;

  @RelationId((feature: Feature) => feature.tenant)
  tenantId: number;

  @Column({ type: 'enum', enum: FeatureType, default: FeatureType.NONE })
  type: FeatureType;

  @ManyToMany(() => Guild, (guild) => guild.features)
  @JoinTable()
  guilds: Guild[];
}
