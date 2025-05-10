import { Server } from '../types/server';

class FiveMService {
  private static async fetchServerInfo(serverId: string): Promise<any> {
    try {
      const response = await fetch(`/api/server?id=${serverId}`);
      if (!response.ok) throw new Error('Failed to fetch server info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching server info:', error);
      throw error;
    }
  }

  static async getServerInfo(serverId: string): Promise<Server | null> {
    try {
      const info = await this.fetchServerInfo(serverId);
      if (!info.Data) return null;

      return {
        ip: info.Data.connectEndPoints[0] || serverId,
        name: info.Data.hostname || 'Unknown Server',
        players: info.Data.players?.length || 0,
        maxPlayers: info.Data.sv_maxclients || 32,
        status: 'online'
      };
    } catch (error) {
      console.error('Error getting server info:', error);
      return null;
    }
  }
}

export const fivemService = FiveMService; 