export class CreateGuildConfigDto {
  guildId: number;
  systemChannelId: string;
  announcementChannelId?: string;
  pronounCheckEnabled?: boolean;
  welcomeMessageEnabled?: boolean;
  welcomeMessageConfig?: {
    channelSnowflake: string;
    format: string;
  };
  inactivityCheckEnabled?: boolean;
  inactivityCheckConfig?: {
    inactiveRoleId: string;
    activeRoleId: string;
    inactiveUserSeconds: number;
  };
  isOpenAIEnabled?: boolean;
}
