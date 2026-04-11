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