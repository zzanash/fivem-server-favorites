import { Server } from '@/types/server';

class FiveMService {
  private static async fetchServerInfo(ip: string): Promise<any> {
    try {
      const response = await fetch(`https://${ip}/info.json`);
      if (!response.ok) throw new Error('Failed to fetch server info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching server info:', error);
      throw error;
    }
  }

  static async getServerInfo(ip: string): Promise<Server | null> {
    try {
      const info = await this.fetchServerInfo(ip);
      return {
        ip,
        name: info.vars?.sv_projectName || 'Unknown Server',
        players: info.players?.length || 0,
        maxPlayers: info.vars?.sv_maxClients || 32,
        status: 'online'
      };
    } catch (error) {
      console.error('Error getting server info:', error);
      return null;
    }
  }
}

export const fivemService = FiveMService; 