import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

export enum EmailType {
  NONE = 'none',
  SMTP = 'smtp',
}

@Entity()
export class EmailConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Tenant, (tenant) => tenant.emailConfig, {
    nullable: false,
  })
  tenant: Tenant;

  @RelationId((emailConfig: EmailConfig) => emailConfig.tenant)
  tenantId: number;

  @Column({ type: 'enum', enum: EmailType, default: EmailType.NONE })
  emailType: EmailType;

  @Column({ type: 'simple-json', nullable: true })
  smtpConfiguration: object;

  @Column({ nullable: true })
  from: string;
}
