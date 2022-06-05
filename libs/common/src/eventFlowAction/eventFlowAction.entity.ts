import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventFlow } from '../eventFlow/eventFlow.entity';

export enum ActionType {
  NONE,
  SEND_MESSAGE,
  ADD_ROLE,
  REMOVE_ROLE,
}

@Entity()
export class EventFlowAction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => EventFlow, (eventFlow) => eventFlow.actions, {
    onDelete: 'CASCADE',
  })
  eventFlow: EventFlow;

  @Column({
    type: 'enum',
    enum: ActionType,
    default: ActionType.NONE,
  })
  actionType: ActionType;

  @Column({ type: 'simple-json' })
  actionConfig: string;
}
