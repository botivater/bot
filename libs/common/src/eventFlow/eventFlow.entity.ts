import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventFlowAction } from '../eventFlowAction/eventFlowAction.entity';
import { EventFlowCondition } from '../eventFlowCondition/eventFlowCondition.entity';
import { EventFlowTrigger } from '../eventFlowTrigger/eventFlowTrigger.entity';
import { Guild } from '../guild/guild.entity';

@Entity()
export class EventFlow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, (guild) => guild.eventFlows, { onDelete: 'CASCADE' })
  guild: Guild;

  @Column()
  name: string;

  @Column()
  shortDescription: string;

  @OneToMany(
    () => EventFlowTrigger,
    (eventFlowTrigger) => eventFlowTrigger.eventFlow,
  )
  triggers: EventFlowTrigger[];

  @OneToMany(
    () => EventFlowCondition,
    (eventFlowCondition) => eventFlowCondition.eventFlow,
  )
  conditions: EventFlowCondition[];

  @OneToMany(
    () => EventFlowAction,
    (eventFlowAction) => eventFlowAction.eventFlow,
  )
  actions: EventFlowAction[];
}
