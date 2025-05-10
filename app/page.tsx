'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fivemService } from './services/fivemService';
import { Server } from './types/server';

export default function Home() {
  const [servers, setServers] = useLocalStorage<Server[]>('favorite-servers', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const response = await fetch(`/api/server?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch servers');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search servers. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddServer = (server: any) => {
    const newServer: Server = {
      ip: server.EndPoint,
      name: server.Data?.hostname || 'Unknown Server',
      players: server.Data?.players?.length || 0,
      maxPlayers: server.Data?.vars?.sv_maxClients || 32,
      status: 'online'
    };

    if (!servers.find(s => s.ip === newServer.ip)) {
      setServers([...servers, newServer]);
    }
  };

  const handleRemoveServer = (ip: string) => {
    setServers(servers.filter(server => server.ip !== ip));
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">FiveM Server Favorites</h1>
        
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search servers..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
            <div className="grid gap-4">
              {searchResults.map((server) => (
                <div key={server.EndPoint} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{server.Data?.hostname || 'Unknown Server'}</h3>
                      <p className="text-sm text-gray-500">
                        Players: {server.Data?.players?.length || 0}/{server.Data?.vars?.sv_maxClients || 32}
                      </p>
                      <p className="text-sm text-gray-500">
                        IP: {server.EndPoint}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddServer(server)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Add to Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Servers */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Favorite Servers</h2>
          <div className="grid gap-4">
            {servers.map((server) => (
              <div key={server.ip} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{server.name}</h3>
                    <p className="text-sm text-gray-500">
                      Players: {server.players}/{server.maxPlayers}
                    </p>
                    <p className="text-sm text-gray-500">
                      IP: {server.ip}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveServer(server.ip)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {servers.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No favorite servers added yet. Search and add servers above!
            </p>
          )}
        </div>
      </div>
    </main>
  );
} 