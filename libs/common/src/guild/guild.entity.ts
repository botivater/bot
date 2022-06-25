import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { CommandFlowGroup } from '../commandFlowGroup/commandFlowGroup.entity';
import { CommandInvocation } from '../commandInvocation/commandInvocation.entity';
import { CommandList } from '../commandList/commandList.entity';
import { EventFlow } from '../eventFlow/eventFlow.entity';
import { GuildConfig } from '../guildConfig/guildConfig.entity';
import { GuildMember } from '../guildMember/guildMember.entity';
import { GuildChannel } from '../guildChannel/guildChannel.entity';
import { Report } from '../report/report.entity';
import { Tenant } from '../tenant/tenant.entity';
import { CommandAlias } from '../commandAlias/commandAlias.entity';
import { OpenAIUsage } from '../openAIUsage/openAIUsage.entity';

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

  @OneToMany(() => GuildChannel, (guildChannel) => guildChannel.guild)
  guildChannels: GuildChannel[];

  @OneToOne(() => GuildConfig, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  guildConfig: GuildConfig;

  @RelationId((guild: Guild) => guild.guildConfig)
  guildConfigId?: number;

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

  @ManyToOne(() => Tenant, (tenant) => tenant.guilds)
  tenant: Tenant;

  @RelationId((guild: Guild) => guild.tenant)
  tenantId: number;

  @OneToMany(() => Report, (report) => report.guild)
  reports: Report[];

  @OneToMany(() => CommandAlias, (commandAlias) => commandAlias.guild)
  commandAliases: CommandAlias[];

  @OneToMany(() => OpenAIUsage, (openAIUsage) => openAIUsage.guild)
  openAIUsage: OpenAIUsage[];
}
