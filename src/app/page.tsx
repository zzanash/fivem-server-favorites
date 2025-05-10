'use client';

import { useState } from 'react';
import { fivemService, Server } from '@/services/fivemService';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const [favoriteServers, setFavoriteServers] = useLocalStorage<Server[]>('favoriteServers', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Server[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const results = await fivemService.searchServers(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const addToFavorites = (server: Server) => {
    if (!favoriteServers.find(s => s.id === server.id)) {
      setFavoriteServers([...favoriteServers, server]);
    }
  };

  const removeFromFavorites = (serverId: string) => {
    setFavoriteServers(favoriteServers.filter(s => s.id !== serverId));
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">FiveM Server List</h1>
        
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search servers..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((server) => (
                <div key={server.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{server.name}</h3>
                    <button
                      onClick={() => addToFavorites(server)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      Players: {server.players}/{server.maxPlayers}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      Status: {server.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Servers */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Favorite Servers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteServers.map((server) => (
              <div key={server.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{server.name}</h3>
                  <button
                    onClick={() => removeFromFavorites(server.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    Players: {server.players}/{server.maxPlayers}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Status: {server.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 