import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { CommandFlowGroup } from '../commandFlowGroup/commandFlowGroup.entity';

@Entity()
export class CommandFlow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => CommandFlowGroup,
    (commandFlowGroup) => commandFlowGroup.commandFlows,
    {
      onDelete: 'CASCADE',
    },
  )
  commandFlowGroup: CommandFlowGroup;

  @RelationId((commandFlow: CommandFlow) => commandFlow.commandFlowGroup)
  commandFlowGroupId: number;

  @Column({ type: 'tinyint' })
  onType: number;

  @Column({ type: 'tinyint' })
  buildingBlockType: number;

  @Column({ type: 'tinyint', nullable: true })
  checkType: number;

  @Column({ nullable: true })
  checkValue: string;

  @Column({ type: 'simple-json' })
  options: string;

  @Column()
  order: number;
}
