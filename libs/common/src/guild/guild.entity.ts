import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommandFlowGroup } from '../commandFlowGroup/commandFlowGroup.entity';
import { CommandInvocation } from '../commandInvocation/commandInvocation.entity';
import { CommandList } from '../commandList/commandList.entity';
import { EventFlow } from '../eventFlow/eventFlow.entity';
import { GuildConfig } from '../guildConfig/guildConfig.entity';
import { GuildMember } from '../guildMember/guildMember.entity';

@Entity()
export class Guild {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 64 })
  snowflake: string;

  @Column()
  name: string;

  @OneToMany(() => GuildMember, (guildMember) => guildMember.guild)
  guildMembers: GuildMember[];

  @OneToOne(() => GuildConfig, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  guildConfig: GuildConfig;

  @OneToMany(() => CommandList, (commandList) => commandList.guild)
  commandLists: CommandList[];

  @OneToMany(
    () => CommandInvocation,
    (commandInvocation) => commandInvocation.guild,
  )
  commandInvocations: CommandInvocation[];

  @OneToMany(
    () => CommandFlowGroup,
    (commandFlowGroup) => commandFlowGroup.guild,
  )
  commandFlowGroups: CommandFlowGroup[];

  @OneToMany(() => EventFlow, (eventFlow) => eventFlow.guild)
  eventFlows: EventFlow[];
}
