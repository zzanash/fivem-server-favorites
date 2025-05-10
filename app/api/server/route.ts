import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serverId = searchParams.get('id');
  const search = searchParams.get('search');

  try {
    if (search) {
      // Extract IP and port from the search query
      const [ip, port] = search.split(':');
      if (!ip || !port) {
        throw new Error('Invalid server address. Please use format: IP:PORT');
      }

      // Fetch server info directly from the server
      const response = await fetch(`http://${ip}:${port}/info.json`, {
        headers: {
          'User-Agent': 'FiveM-Server-Favorites/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Server info fetch failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch server info: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the data to match our expected format
      const transformedData = [{
        EndPoint: `${ip}:${port}`,
        Data: {
          hostname: data.vars?.sv_hostname || 'Unknown Server',
          players: data.players || [],
          vars: {
            sv_maxClients: data.vars?.sv_maxClients || 32
          }
        }
      }];

      return NextResponse.json(transformedData);
    } else if (serverId) {
      // Extract IP and port from the server ID
      const [ip, port] = serverId.split(':');
      if (!ip || !port) {
        throw new Error('Invalid server address. Please use format: IP:PORT');
      }

      // Fetch server info directly from the server
      const response = await fetch(`http://${ip}:${port}/info.json`, {
        headers: {
          'User-Agent': 'FiveM-Server-Favorites/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Server info fetch failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch server info: ${response.statusText}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      throw new Error('Please provide a server address to search');
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 