import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventFlow } from '../eventFlow/eventFlow.entity';

export enum EventType {
  NONE,

  MESSAGE,
  MESSAGE_CREATED,
  MESSAGE_EDITED,
  MESSAGE_DELETED,

  REACTION,
  REACTION_ADDED,
  REACTION_DELETED,
}

@Entity()
export class EventFlowTrigger {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => EventFlow, (eventFlow) => eventFlow.triggers, {
    onDelete: 'CASCADE',
  })
  eventFlow: EventFlow;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.NONE,
  })
  eventType: EventType;
}
