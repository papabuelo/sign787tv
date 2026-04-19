'use client';

import Topbar from '@/components/Topbar';
import { Plus, ListVideo, Clock, Play, Settings, Monitor, User, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { allClients } from '@/types';
import { allDevices } from '@/types';
import { 
  getAllPlaylists, 
  getClientPlaylists, 
  getDevicePlaylists,
  togglePlaylistStatus,
  deletePlaylist,
  createPlaylist,
  type Playlist 
} from '@/lib/playlists';
import { getAllAdminContent, type ContentItem } from '@/lib/admin-control';
import './styles.css';

// Simulación de cliente autenticado (en producción vendría de auth)
const currentClientId = 'CLIENT-001'; // Para vista de cliente
const isAdmin = true; // Cambiar a false para vista de cliente

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [availableContent, setAvailableContent] = useState<ContentItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Función para abrir el modal y recargar contenido
  const openCreateModal = () => {
    setShowCreateModal(true);
    // Recargar contenido disponible cuando se abre el modal
    if (isAdmin) {
      setAvailableContent(getAllAdminContent());
    } else {
      setAvailableContent(getAllAdminContent());
    }
  };
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Cargar playlists según rol
    let allPlaylists: Playlist[];
    
    if (isAdmin) {
      // Admin ve todas las playlists
      allPlaylists = getAllPlaylists();
    } else {
      // Cliente solo ve sus playlists
      allPlaylists = getClientPlaylists(currentClientId);
    }
    
    setPlaylists(allPlaylists);
    
    // Cargar contenido disponible
    if (isAdmin) {
      setAvailableContent(getAllAdminContent());
    } else {
      // Cliente solo ve contenido asignado a sus dispositivos
      setAvailableContent(getAllAdminContent()); // Por ahora, mismo contenido
    }
    
    setLoading(false);
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() && selectedContentIds.length > 0) {
      const selectedContent = availableContent.filter(c => selectedContentIds.includes(c.id));
      
      // Para admin, usar cliente y dispositivo seleccionados
      // Para cliente, usar su ID y dispositivo seleccionado
      const targetClientId = isAdmin ? (selectedClient !== 'all' ? selectedClient : 'CLIENT-001') : currentClientId;
      const targetDeviceId = selectedDevice !== 'all' ? selectedDevice : 'DEVICE-001';
      
      createPlaylist(
        newPlaylistName,
        targetDeviceId,
        targetClientId,
        selectedContent
      );
      
      setNewPlaylistName('');
      setSelectedContentIds([]);
      setShowCreateModal(false);
      loadData();
    }
  };

  const handleToggleStatus = (playlistId: string) => {
    togglePlaylistStatus(playlistId);
    loadData();
  };

  const handleDelete = (playlistId: string) => {
    if (confirm('¿Estás seguro de eliminar esta playlist?')) {
      deletePlaylist(playlistId);
      loadData();
    }
  };

  // Filtrar playlists según selección
  const filteredPlaylists = playlists.filter(playlist => {
    if (selectedDevice !== 'all' && playlist.deviceId !== selectedDevice) return false;
    if (selectedClient !== 'all' && playlist.clientId !== selectedClient) return false;
    return true;
  });

  const totalDuration = filteredPlaylists.reduce((sum, p) => sum + p.duration, 0);
  const activePlaylists = filteredPlaylists.filter(p => p.isActive).length;

  // Obtener dispositivos y clientes para filtros
  const devices = isAdmin ? allDevices : allDevices.filter(d => d.clientId === currentClientId);
  const clients = isAdmin ? allClients : allClients.filter(c => c.id === currentClientId);

  return (
    <div>
      <Topbar 
        title={isAdmin ? "Gestión de Playlists" : "Mis Playlists"} 
        subtitle={loading 
          ? 'Cargando playlists...' 
          : `${filteredPlaylists.length} playlists · ${activePlaylists} activas · ${Math.round(totalDuration / 60)} min total`
        } 
      />

      <div style={{ padding: '28px 32px' }}>
        {/* Header con controles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
              {isAdmin ? "Todas las Playlists" : "Mis Playlists Asignadas"}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {isAdmin 
                ? "Crea y gestiona playlists para tus clientes" 
                : "Visualiza las playlists que el administrador ha asignado a tus dispositivos"
              }
            </p>
          </div>
          
          {isAdmin && (
            <button 
              className="btn-primary"
              onClick={openCreateModal}
            >
              <Plus size={15} /> Nueva Playlist
            </button>
          )}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="var(--text-secondary)" />
              <select 
                value={selectedClient} 
                onChange={(e) => setSelectedClient(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)',
                  fontSize: '13px', cursor: 'pointer'
                }}
              >
                <option value="all">Todos los Clientes</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}
          
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
            const device = allDevices.find(d => d.id === playlist.deviceId);
            const client = allClients.find(c => c.id === playlist.clientId);
            
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
                    <span style={{ fontSize: '13px' }}>Creada: {new Date(playlist.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Mini preview de contenido */}
                {playlist.content.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Contenido:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                      {playlist.content.slice(0, 3).map((item, index) => (
                        <div key={item.id} style={{ 
                          minWidth: '60px', 
                          height: '40px', 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'var(--text-secondary)'
                        }}>
                          {item.type === 'image' ? '🖼️' : '🎥'}
                        </div>
                      ))}
                      {playlist.content.length > 3 && (
                        <div style={{ 
                          minWidth: '60px', 
                          height: '40px', 
                          backgroundColor: 'rgba(255,255,255,0.05)', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'var(--text-secondary)'
                        }}>
                          +{playlist.content.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--border)'
                }}>
                  <button className="btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '6px 12px' }}>
                    <Eye size={12} /> Ver
                  </button>
                  
                  {isAdmin && (
                    <>
                      <button 
                        className="btn-secondary" 
                        style={{ fontSize: '13px', padding: '6px 12px' }}
                        onClick={() => handleToggleStatus(playlist.id)}
                      >
                        {playlist.isActive ? <Settings size={12} /> : <Play size={12} />}
                        {playlist.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      
                      <button 
                        className="btn-secondary" 
                        style={{ fontSize: '13px', padding: '6px 12px', color: 'var(--danger)' }}
                        onClick={() => handleDelete(playlist.id)}
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlaylists.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <ListVideo size={48} color="var(--text-secondary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
              {isAdmin ? "No hay playlists" : "No tienes playlists asignadas"}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {isAdmin 
                ? 'Crea tu primera playlist para comenzar'
                : 'El administrador aún no ha asignado playlists a tus dispositivos'
              }
            </p>
            {isAdmin && (
              <button className="btn-primary" onClick={openCreateModal}>
                <Plus size={15} /> Crear Playlist
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nueva Playlist</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <label>Nombre de la Playlist</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Ej: Promociones de Verano"
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label>Seleccionar Contenido</label>
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', 
                  padding: '12px' 
                }}>
                  {availableContent.map(content => (
                    <div key={content.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '8px',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: selectedContentIds.includes(content.id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedContentIds.includes(content.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContentIds([...selectedContentIds, content.id]);
                          } else {
                            setSelectedContentIds(selectedContentIds.filter(id => id !== content.id));
                          }
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{content.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {content.type === 'image' ? 'Imagen' : 'Video'} • {Math.round(content.duration / 1000)}s
                        </div>
                      </div>
                      <div style={{ fontSize: '20px' }}>
                        {content.type === 'image' ? '🖼️' : '🎥'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedContentIds.length > 0 && (
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '16px',
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px'
                }}>
                  Duración total: {Math.round(
                    selectedContentIds.reduce((sum, id) => {
                      const content = availableContent.find(c => c.id === id);
                      return sum + (content?.duration || 0);
                    }, 0) / 1000
                  )} segundos
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim() || selectedContentIds.length === 0}
              >
                Crear Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}