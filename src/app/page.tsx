'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { fivemService } from '@/services/fivemService';
import { Server } from '@/types/server';

export default function Home() {
  const [servers, setServers] = useLocalStorage<Server[]>('favorite-servers', []);
  const [newServer, setNewServer] = useState('');
  const [error, setError] = useState('');

  const handleAddServer = async () => {
    if (!newServer) return;

    try {
      const serverInfo = await fivemService.getServerInfo(newServer);
      if (serverInfo) {
        setServers([...servers, serverInfo]);
        setNewServer('');
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch server information. Please check the IP and try again.');
    }
  };

  const handleRemoveServer = (ip: string) => {
    setServers(servers.filter(server => server.ip !== ip));
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">FiveM Server Favorites</h1>
        
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newServer}
              onChange={(e) => setNewServer(e.target.value)}
              placeholder="Enter server IP (e.g., 127.0.0.1:30120)"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddServer}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Server
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        <div className="grid gap-4">
          {servers.map((server) => (
            <div key={server.ip} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{server.name}</h2>
                  <p className="text-gray-600">{server.ip}</p>
                  <p className="text-sm text-gray-500">
                    Players: {server.players}/{server.maxPlayers}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveServer(server.ip)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {servers.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No favorite servers added yet. Add your first server above!
          </p>
        )}
      </div>
    </main>
  );
} 