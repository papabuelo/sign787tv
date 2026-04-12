'use client';

import Topbar from '@/components/Topbar';
import {
  Monitor, Wifi, WifiOff, Plus, Filter, Download,
  MoreVertical, RefreshCw, Power, Send, Eye, MapPin, Cpu, HardDrive,
  Layout, Settings, Play, Building, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { allClients } from '@/types';
import type { Device, DeviceStatus } from '@/types';

// Dispositivo de prueba funcional - se puede eliminar/modificar después
export const allDevices: Device[] = [
  { 
    id: 'TEST-001', 
    name: 'Dispositivo-Prueba-SIGN787', 
    clientId: 'CLIENT-001',
    client: 'Demo Client', 
    location: 'Laboratorio, PR', 
    status: 'online', 
    layout: 'Full Screen', 
    uptime: '100%', 
    lastSeen: 'Ahora', 
    ip: '192.168.1.100', 
    storage: 15, 
    version: '2.4.1' 
  }
];

const statusLabels: Record<DeviceStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Alerta',
};

export default function DevicesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | DeviceStatus>('all');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadDevices() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) {
          console.error('Error cargando dispositivos:', error);
          // Usar datos de prueba mientras tanto
          setDevices(allDevices);
        } else if (data && data.length > 0) {
          setDevices(data as Device[]);
        } else {
          // Si no hay dispositivos en la base de datos, usar el de prueba
          setDevices(allDevices);
        }
      } catch (err) {
        console.error('Error conectando a Supabase:', err);
        setDevices(allDevices);
      }
      setLoading(false);
    }
    
    loadDevices();
  }, []);

  const filtered = devices.filter(device => {
    const clientMatch = selectedClient === 'all' || device.clientId === selectedClient;
    const statusMatch = filter === 'all' || device.status === filter;
    return clientMatch && statusMatch;
  });
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  const warningCount = devices.filter(d => d.status === 'warning').length;

  // Función para crear un dispositivo de prueba
  const createTestDevice = () => {
    const testDevice: Device = {
      id: `TEST-${Date.now().toString().slice(-4)}`,
      name: `Dispositivo-Prueba-${devices.length + 1}`,
      clientId: 'CLIENT-001',
      client: 'Cliente Demo',
      location: 'Ubicación Demo',
      status: 'online',
      layout: 'Full Screen',
      uptime: '100%',
      lastSeen: 'Ahora',
      ip: '192.168.1.200',
      storage: Math.floor(Math.random() * 50) + 10,
      version: '2.4.1'
    };
    
    setDevices([...devices, testDevice]);
  };

  // Función para cambiar el layout de un dispositivo
  const changeDeviceLayout = (deviceId: string, newLayout: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, layout: newLayout }
        : device
    ));
  };

  return (
    <div>
      <Topbar 
        title="Dispositivos" 
        subtitle={loading 
          ? 'Cargando dispositivos...' 
          : selectedClient === 'all' 
            ? `${devices.length} dispositivos registrados · ${onlineCount} online`
            : `${devices.length} dispositivos · ${allClients.find(c => c.id === selectedClient)?.name}`
        } 
      />

      <div style={{ padding: '28px 32px' }}>

        {/* Filtro por Cliente */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={16} color="var(--text-secondary)" />
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
              {allClients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {selectedClient === 'all' 
              ? `${allClients.length} clientes` 
              : allClients.find(c => c.id === selectedClient)?.name
            }
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {([
              { key: 'all', label: `Todos (${devices.length})` },
              { key: 'online', label: `Online (${onlineCount})` },
              { key: 'warning', label: `Alerta (${warningCount})` },
              { key: 'offline', label: `Offline (${offlineCount})` },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '8px 16px', borderRadius: '9px', border: 'none',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.18s',
                  background: filter === tab.key ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: filter === tab.key ? '#60a5fa' : 'var(--text-secondary)',
                  boxShadow: filter === tab.key ? '0 0 0 1px rgba(59,130,246,0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary">
              <Download size={15} /> Exportar
            </button>
            <button className="btn-primary" onClick={createTestDevice}>
              <Plus size={15} /> Agregar Dispositivo Demo
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dispositivo</th>
                  <th>Cliente / Ubicación</th>
                  <th>Estado</th>
                  <th>Layout Activo</th>
                  <th>Storage</th>
                  <th>Última Conexión</th>
                  <th>Versión</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((device) => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '9px',
                          background: device.status === 'online' ? 'rgba(16,185,129,0.1)' :
                                      device.status === 'offline' ? 'rgba(100,116,139,0.1)' : 'rgba(245,158,11,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `1px solid ${device.status === 'online' ? 'rgba(16,185,129,0.2)' : device.status === 'offline' ? 'rgba(100,116,139,0.2)' : 'rgba(245,158,11,0.2)'}`
                        }}>
                          <Monitor size={17} color={device.status === 'online' ? '#34d399' : device.status === 'offline' ? '#64748b' : '#fbbf24'} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13.5px' }}>{device.name}</p>
                          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{device.id} · {device.ip}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{device.client}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                        <MapPin size={10} /> {device.location}
                      </p>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`status-dot status-${device.status}`} />
                        <span className={`badge ${device.status === 'online' ? 'badge-green' : device.status === 'offline' ? '' : 'badge-amber'}`}
                          style={device.status === 'offline' ? { background: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' } : {}}>
                          {statusLabels[device.status]}
                        </span>
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-blue">{device.layout}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Opciones de layouts disponibles
                            const layouts = ['Full Screen', '2-Split', '4 Zonas', 'L-Shape', 'Main + Ticker'];
                            const currentIndex = layouts.indexOf(device.layout);
                            const nextLayout = layouts[(currentIndex + 1) % layouts.length];
                            changeDeviceLayout(device.id, nextLayout);
                          }}
                          title="Cambiar layout"
                          style={{
                            width: '24px', height: '24px', borderRadius: '6px',
                            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                          }}
                        >
                          <Layout size={12} color="#60a5fa" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '60px' }}>
                          <div className="progress-fill" style={{
                            width: `${device.storage}%`,
                            background: device.storage > 80 ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                                        device.storage > 60 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                        'linear-gradient(90deg, #3b82f6, #60a5fa)'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', color: device.storage > 80 ? '#f87171' : 'var(--text-secondary)' }}>
                          {device.storage}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', whiteSpace: 'nowrap' }}>{device.lastSeen}</td>
                    <td>
                      <span className={`badge ${device.version === '2.4.1' ? 'badge-green' : 'badge-amber'}`}>{device.version}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button title="Enviar comando" style={{
                          width: '30px', height: '30px', borderRadius: '7px',
                          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}>
                          <Send size={13} color="#60a5fa" />
                        </button>
                        <button 
                          title="Ver Preview" 
                          style={{
                            width: '30px', height: '30px', borderRadius: '7px',
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/preview?device=${device.id}`);
                          }}
                        >
                          <Play size={13} color="#4ade80" />
                        </button>
                        <button title="Ver detalles" style={{
                          width: '30px', height: '30px', borderRadius: '7px',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}>
                          <MoreVertical size={13} color="var(--text-secondary)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer count */}
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Mostrando {filtered.length} de {devices.length} dispositivos
        </p>
      </div>
    </div>
  );
}
