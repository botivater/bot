import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventFlow } from '../eventFlow/eventFlow.entity';

export enum CheckType {
  NONE,
  USER,
  MESSAGE_TEXT,
  REACTION_EMOJI,
}

export enum CheckComparator {
  NONE,
  CONTAINS,
  EQUALS,
  STARTS_WITH,
  ENDS_WITH,
}

@Entity()
export class EventFlowCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => EventFlow, (eventFlow) => eventFlow.conditions, {
    onDelete: 'CASCADE',
  })
  eventFlow: EventFlow;

  @Column({
    type: 'enum',
    enum: CheckType,
    default: CheckType.NONE,
  })
  checkType: CheckType;

  @Column({
    type: 'enum',
    enum: CheckComparator,
    default: CheckComparator.NONE,
  })
  checkComparator: CheckComparator;

  @Column()
  checkValue: string;
}
