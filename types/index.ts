export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  devicesCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  deviceId: string;
  content: string[]; // Array de IDs de contenido
  duration: number; // Duración total en segundos
  isActive: boolean;
  createdAt: string;
}

// Clientes de prueba
// Dispositivos de prueba
export const allDevices: Device[] = [
  {
    id: 'DEVICE-001',
    name: 'Pantalla Principal',
    clientId: 'CLIENT-001',
    client: 'Demo Client',
    location: 'Lobby Principal',
    status: 'online',
    layout: 'Full Screen',
    uptime: '99.9%',
    lastSeen: '2024-03-15T10:30:00Z',
    ip: '192.168.1.100',
    storage: 75,
    version: '1.0.0'
  },
  {
    id: 'DEVICE-002',
    name: 'Pantalla de Menú',
    clientId: 'CLIENT-002',
    client: 'Burger King Bayamón',
    location: 'Área de Pedidos',
    status: 'online',
    layout: '2-Split',
    playlistId: 'PLAYLIST-001',
    uptime: '98.5%',
    lastSeen: '2024-03-15T10:25:00Z',
    ip: '192.168.1.101',
    storage: 82,
    version: '1.0.0'
  },
  {
    id: 'DEVICE-003',
    name: 'Pantalla Promocional',
    clientId: 'CLIENT-002',
    client: 'Burger King Bayamón',
    location: 'Área de Espera',
    status: 'warning',
    layout: '4 Zonas',
    uptime: '95.2%',
    lastSeen: '2024-03-15T09:45:00Z',
    ip: '192.168.1.102',
    storage: 91,
    version: '1.0.0'
  },
  {
    id: 'DEVICE-004',
    name: 'Pantalla de Entrada',
    clientId: 'CLIENT-003',
    client: 'Subway Plaza',
    location: 'Entrada Principal',
    status: 'online',
    layout: 'Main + Ticker',
    playlistId: 'PLAYLIST-002',
    uptime: '99.1%',
    lastSeen: '2024-03-15T10:28:00Z',
    ip: '192.168.1.103',
    storage: 67,
    version: '1.0.0'
  }
];

export const allClients: Client[] = [
  {
    id: 'CLIENT-001',
    name: 'Demo Client',
    email: 'demo@client.com',
    phone: '(787) 555-0001',
    address: 'Laboratorio, PR',
    createdAt: '2024-01-15',
    devicesCount: 1
  },
  {
    id: 'CLIENT-002',
    name: 'Burger King Bayamón',
    email: 'admin@bk-bayamon.com',
    phone: '(787) 555-1001',
    address: 'Bayamón, PR',
    createdAt: '2024-02-01',
    devicesCount: 2
  },
  {
    id: 'CLIENT-003',
    name: 'Subway Plaza',
    email: 'manager@subway-plaza.com',
    phone: '(787) 555-2001',
    address: 'Hato Rey, PR',
    createdAt: '2024-02-15',
    devicesCount: 1
  }
];

export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface Device {
  id: string;
  name: string;
  clientId: string; // ID del cliente propietario
  client: string; // Nombre del cliente (para display)
  location: string;
  status: DeviceStatus;
  layout: string;
  playlistId?: string; // ID de la playlist actual
  uptime: string;
  lastSeen: string;
  ip: string;
  storage: number;
  version: string;
}