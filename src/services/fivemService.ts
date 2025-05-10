import axios from 'axios';

const FIVEM_LIST_API = 'https://api.fivemlist.net/api';

export interface Server {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: string;
  ip: string;
  port: number;
  description: string;
  banner: string;
  tags: string[];
}

export const fivemService = {
  async searchServers(query: string): Promise<Server[]> {
    try {
      const response = await axios.get(`${FIVEM_LIST_API}/servers/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching servers:', error);
      return [];
    }
  },

  async getServerDetails(serverId: string): Promise<Server | null> {
    try {
      const response = await axios.get(`${FIVEM_LIST_API}/servers/${serverId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting server details:', error);
      return null;
    }
  }
}; 