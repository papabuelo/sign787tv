'use client';

import Topbar from '@/components/Topbar';
import { Plus, ListVideo, Clock, Play, Settings, Monitor, User, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { allClients } from '@/types';
import type { Playlist, Device } from '@/types';

// Playlists de prueba
const samplePlaylists: Playlist[] = [
  {
    id: 'PLAYLIST-001',
    name: 'Playlist Principal - Demo Client',
    deviceId: 'TEST-001',
    content: ['CONTENT-001', 'CONTENT-002', 'CONTENT-003'],
    duration: 180, // 3 minutos
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'PLAYLIST-002',
    name: 'Promociones Burger King',
    deviceId: 'BK-001',
    content: ['CONTENT-004', 'CONTENT-005'],
    duration: 120, // 2 minutos
    isActive: false,
    createdAt: '2024-02-01'
  },
  {
    id: 'PLAYLIST-003',
    name: 'Menú del Día - Subway',
    deviceId: 'SUBWAY-001',
    content: ['CONTENT-006', 'CONTENT-007', 'CONTENT-008', 'CONTENT-009'],
    duration: 240, // 4 minutos
    isActive: true,
    createdAt: '2024-02-15'
  }
];

// Dispositivos de prueba
const sampleDevices: Device[] = [
  {
    id: 'TEST-001',
    name: 'Dispositivo-Prueba-SIGN787',
    clientId: 'CLIENT-001',
    client: 'Demo Client',
    location: 'Laboratorio, PR',
    status: 'online',
    layout: 'Full Screen',
    playlistId: 'PLAYLIST-001',
    uptime: '100%',
    lastSeen: 'Ahora',
    ip: '192.168.1.100',
    storage: 15,
    version: '2.4.1'
  }
];

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por ahora usar datos de prueba
    setPlaylists(samplePlaylists);
    setDevices(sampleDevices);
    setLoading(false);
  }, []);

  const filteredPlaylists = selectedDevice === 'all' 
    ? playlists 
    : playlists.filter(p => p.deviceId === selectedDevice);

  const totalDuration = filteredPlaylists.reduce((sum, p) => sum + p.duration, 0);
  const activePlaylists = filteredPlaylists.filter(p => p.isActive).length;

  return (
    <div>
      <Topbar 
        title="Playlists" 
        subtitle={loading 
          ? 'Cargando playlists...' 
          : `${filteredPlaylists.length} playlists · ${activePlaylists} activas · ${Math.round(totalDuration / 60)} min total`
        } 
      />

      <div style={{ padding: '28px 32px' }}>
        {/* Header con controles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Gestión de Playlists</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Cada dispositivo puede tener su propia playlist de contenido
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={15} /> Nueva Playlist
          </button>
        </div>

        {/* Filtro por dispositivo */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={16} color="var(--text-secondary)" />
            <select 
              value={selectedDevice} 
              onChange={(e) => setSelectedDevice(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)',
                fontSize: '13px', cursor: 'pointer'
              }}
            >
              <option value="all">Todos los Dispositivos</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>{device.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {selectedDevice === 'all' 
              ? `${devices.length} dispositivos` 
              : devices.find(d => d.id === selectedDevice)?.name
            }
          </div>
        </div>

        {/* Grid de playlists */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredPlaylists.map((playlist) => {
            const device = devices.find(d => d.id === playlist.deviceId);
            const client = allClients.find(c => c.id === device?.clientId);
            
            return (
              <div key={playlist.id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>
                      {playlist.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Monitor size={12} />
                      <span>{device?.name || 'Dispositivo no encontrado'}</span>
                    </div>
                    {client && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <User size={12} />
                        <span>{client.name}</span>
                      </div>
                    )}
                  </div>
                  <span className={`badge ${playlist.isActive ? 'badge-green' : ''}`}>
                    {playlist.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ListVideo size={14} color="var(--text-secondary)" />
                    <span style={{ fontSize: '13px' }}>{playlist.content.length} elementos</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="var(--text-secondary)" />
                    <span style={{ fontSize: '13px' }}>{Math.round(playlist.duration / 60)} min</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--text-secondary)" />
                    <span style={{ fontSize: '13px' }}>Creada: {playlist.createdAt}</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border)'
                }}>
                  <button className="btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '6px 12px' }}>
                    <Play size={12} /> Previsualizar
                  </button>
                  <button className="btn-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    <Settings size={12} /> Configurar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlaylists.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <ListVideo size={48} color="var(--text-secondary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No hay playlists</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {selectedDevice === 'all' 
                ? 'Crea tu primera playlist para comenzar'
                : 'Este dispositivo aún no tiene playlists'
              }
            </p>
            <button className="btn-primary">
              <Plus size={15} /> Crear Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}