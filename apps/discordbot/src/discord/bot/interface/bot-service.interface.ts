export interface IBotService {
  loadAllGuildsCommands(): Promise<void>;
  loadGuildCommands(guildId: number): Promise<void>;
}
