// Sistema de playlists para SIGN787 TV
// Integrado con el sistema de control administrativo

import { 
  getDeviceAssignedContent, 
  getContentById, 
  type ContentItem,
  type AdminContentAssignment 
} from './admin-control';
import { allDevices } from '@/types';

export interface Playlist {
  id: string;
  name: string;
  deviceId: string;
  clientId: string;
  content: ContentItem[]; // Contenido real, no solo IDs
  duration: number; // duración total en segundos
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  schedule?: {
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
  };
}

export interface PlaylistItem {
  id: string;
  contentId: string;
  content: ContentItem;
  displayOrder: number;
  duration: number; // duración en segundos
  isActive: boolean;
}

// Base de datos simulada de playlists
const playlistsDB: Playlist[] = [
  {
    id: 'PLAYLIST-001',
    name: 'Promociones Hamburguesas - Cliente Demo',
    deviceId: 'DEVICE-001',
    clientId: 'CLIENT-001',
    content: [],
    duration: 180,
    isActive: true,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'PLAYLIST-002',
    name: 'Menú del Día - Burger King',
    deviceId: 'DEVICE-002',
    clientId: 'CLIENT-002',
    content: [],
    duration: 240,
    isActive: true,
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
    schedule: {
      startTime: '11:00',
      endTime: '15:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Lunes a Viernes
    }
  }
];

// Función para generar playlists automáticamente desde las asignaciones administrativas
export function generatePlaylistsFromAssignments(): Playlist[] {
  const playlists: Playlist[] = [];
  
  // Obtener todos los dispositivos
  const devices = allDevices;
  
  devices.forEach(device => {
    // Obtener contenido asignado a este dispositivo
    const contentAssignments = getDeviceAssignedContent(device.clientId, device.id);
    
    if (contentAssignments.length > 0) {
      // Convertir asignaciones a contenido real
      const contentItems = contentAssignments
        .map((assignment: AdminContentAssignment) => getContentById(assignment.contentId))
        .filter(Boolean) as ContentItem[];
      
      if (contentItems.length > 0) {
        const totalDuration = contentItems.reduce((sum, item) => sum + (item.duration / 1000), 0);
        
        const playlist: Playlist = {
          id: `AUTO-PLAYLIST-${device.id}`,
          name: `Playlist Auto - ${device.name}`,
          deviceId: device.id,
          clientId: device.clientId,
          content: contentItems,
          duration: totalDuration,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        playlists.push(playlist);
      }
    }
  });
  
  return playlists;
}

// Función para obtener todas las playlists (DB + auto-generadas)
export function getAllPlaylists(): Playlist[] {
  const autoPlaylists = generatePlaylistsFromAssignments();
  return [...playlistsDB, ...autoPlaylists];
}

// Función para obtener playlists por cliente
export function getClientPlaylists(clientId: string): Playlist[] {
  return getAllPlaylists().filter(playlist => playlist.clientId === clientId);
}

// Función para obtener playlists por dispositivo
export function getDevicePlaylists(deviceId: string): Playlist[] {
  return getAllPlaylists().filter(playlist => playlist.deviceId === deviceId);
}

// Función para obtener una playlist específica
export function getPlaylistById(playlistId: string): Playlist | undefined {
  return getAllPlaylists().find(playlist => playlist.id === playlistId);
}

// Función para crear una nueva playlist
export function createPlaylist(
  name: string,
  deviceId: string,
  clientId: string,
  content: ContentItem[],
  schedule?: Playlist['schedule']
): Playlist {
  const totalDuration = content.reduce((sum, item) => sum + (item.duration / 1000), 0);
  
  const newPlaylist: Playlist = {
    id: `PLAYLIST-${Date.now()}`,
    name,
    deviceId,
    clientId,
    content,
    duration: totalDuration,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schedule
  };
  
  playlistsDB.push(newPlaylist);
  return newPlaylist;
}

// Función para actualizar una playlist
export function updatePlaylist(
  playlistId: string,
  updates: Partial<Omit<Playlist, 'id' | 'createdAt'>>
): Playlist | undefined {
  const playlistIndex = playlistsDB.findIndex(p => p.id === playlistId);
  
  if (playlistIndex !== -1) {
    playlistsDB[playlistIndex] = {
      ...playlistsDB[playlistIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return playlistsDB[playlistIndex];
  }
  
  return undefined;
}

// Función para activar/desactivar una playlist
export function togglePlaylistStatus(playlistId: string): boolean {
  const playlist = playlistsDB.find(p => p.id === playlistId);
  
  if (playlist) {
    playlist.isActive = !playlist.isActive;
    playlist.updatedAt = new Date().toISOString();
    return true;
  }
  
  return false;
}

// Función para eliminar una playlist
export function deletePlaylist(playlistId: string): boolean {
  const playlistIndex = playlistsDB.findIndex(p => p.id === playlistId);
  
  if (playlistIndex !== -1) {
    playlistsDB.splice(playlistIndex, 1);
    return true;
  }
  
  return false;
}

// Función para agregar contenido a una playlist
export function addContentToPlaylist(playlistId: string, content: ContentItem): boolean {
  const playlist = playlistsDB.find(p => p.id === playlistId);
  
  if (playlist) {
    playlist.content.push(content);
    playlist.duration = playlist.content.reduce((sum, item) => sum + (item.duration / 1000), 0);
    playlist.updatedAt = new Date().toISOString();
    return true;
  }
  
  return false;
}

// Función para quitar contenido de una playlist
export function removeContentFromPlaylist(playlistId: string, contentId: string): boolean {
  const playlist = playlistsDB.find(p => p.id === playlistId);
  
  if (playlist) {
    playlist.content = playlist.content.filter(c => c.id !== contentId);
    playlist.duration = playlist.content.reduce((sum, item) => sum + (item.duration / 1000), 0);
    playlist.updatedAt = new Date().toISOString();
    return true;
  }
  
  return false;
}

// Función para verificar si una playlist debe reproducirse ahora
export function shouldPlayPlaylist(playlist: Playlist): boolean {
  if (!playlist.isActive) return false;
  
  if (!playlist.schedule) return true;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutos desde medianoche
  const currentDay = now.getDay();
  
  if (playlist.schedule.startTime) {
    const [startHour, startMinute] = playlist.schedule.startTime.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    if (currentTime < startTime) return false;
  }
  
  if (playlist.schedule.endTime) {
    const [endHour, endMinute] = playlist.schedule.endTime.split(':').map(Number);
    const endTime = endHour * 60 + endMinute;
    if (currentTime > endTime) return false;
  }
  
  if (playlist.schedule.daysOfWeek && playlist.schedule.daysOfWeek.length > 0) {
    if (!playlist.schedule.daysOfWeek.includes(currentDay)) return false;
  }
  
  return true;
}