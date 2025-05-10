import axios from 'axios';

export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline';
  lastUpdated: string;
}

const API_BASE_URL = 'https://api.fivemlist.net/v1';

export const fivemService = {
  async searchServers(query: string): Promise<Server[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/servers/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching servers:', error);
      return [];
    }
  },

  async getServerStatus(ip: string, port: number): Promise<Server | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/servers/status`, {
        params: { ip, port }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting server status:', error);
      return null;
    }
  }
}; 