'use client';

import Topbar from '@/components/Topbar';
import {
  Monitor, Wifi, WifiOff, Plus, Filter, Download,
  MoreVertical, RefreshCw, Power, Send, Eye, MapPin, Cpu, HardDrive
} from 'lucide-react';
import { useState } from 'react';

type DeviceStatus = 'online' | 'offline' | 'warning';

interface Device {
  id: string;
  name: string;
  client: string;
  location: string;
  status: DeviceStatus;
  layout: string;
  uptime: string;
  lastSeen: string;
  ip: string;
  storage: number;
  version: string;
}

const allDevices: Device[] = [
  { id: 'FS-001', name: 'TV-Entrada-Principal', client: 'Burger King Bayamón', location: 'Bayamón, PR', status: 'online', layout: 'Full Screen', uptime: '99.2%', lastSeen: 'Ahora', ip: '192.168.1.101', storage: 72, version: '2.4.1' },
  { id: 'FS-002', name: 'TV-Caja-Registradora', client: 'Subway Plaza', location: 'Hato Rey, PR', status: 'online', layout: '4 Zonas', uptime: '97.8%', lastSeen: 'hace 1 min', ip: '10.0.0.45', storage: 48, version: '2.4.1' },
  { id: 'FS-003', name: 'TV-Sala-Espera', client: 'Clínica Médica Norte', location: 'Arecibo, PR', status: 'offline', layout: '3 Paneles', uptime: '81.0%', lastSeen: 'hace 3h', ip: '—', storage: 91, version: '2.3.8' },
  { id: 'FS-004', name: 'TV-Vitrina-Exterior', client: 'Walgreens Río Piedras', location: 'Río Piedras, PR', status: 'online', layout: '2-Split', uptime: '98.5%', lastSeen: 'Ahora', ip: '192.168.2.55', storage: 35, version: '2.4.1' },
  { id: 'FS-005', name: 'TV-Lobby', client: 'Banco Popular Santurce', location: 'Santurce, PR', status: 'warning', layout: 'Full Screen', uptime: '92.1%', lastSeen: 'hace 8 min', ip: '172.16.0.12', storage: 65, version: '2.4.0' },
  { id: 'FS-006', name: 'TV-Mostrador', client: 'Pizza Hut Caguas', location: 'Caguas, PR', status: 'online', layout: 'Full Screen', uptime: '99.7%', lastSeen: 'Ahora', ip: '192.168.5.88', storage: 22, version: '2.4.1' },
  { id: 'FS-007', name: 'TV-Exterior-Norte', client: 'Walmart Carolina', location: 'Carolina, PR', status: 'online', layout: '2-Split', uptime: '96.4%', lastSeen: 'hace 2 min', ip: '10.5.0.201', storage: 55, version: '2.4.1' },
  { id: 'FS-008', name: 'TV-Drive-Thru', client: 'McD Guaynabo', location: 'Guaynabo, PR', status: 'offline', layout: 'Full Screen', uptime: '78.3%', lastSeen: 'hace 6h', ip: '—', storage: 88, version: '2.3.5' },
];

const statusLabels: Record<DeviceStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Alerta',
};

export default function DevicesPage() {
  const [filter, setFilter] = useState<'all' | DeviceStatus>('all');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const filtered = filter === 'all' ? allDevices : allDevices.filter(d => d.status === filter);
  const onlineCount = allDevices.filter(d => d.status === 'online').length;
  const offlineCount = allDevices.filter(d => d.status === 'offline').length;
  const warningCount = allDevices.filter(d => d.status === 'warning').length;

  return (
    <div>
      <Topbar title="Dispositivos" subtitle={`${allDevices.length} dispositivos registrados · ${onlineCount} online`} />

      <div style={{ padding: '28px 32px' }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {([
              { key: 'all', label: `Todos (${allDevices.length})` },
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
            <button className="btn-primary">
              <Plus size={15} /> Agregar Dispositivo
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
                    <td><span className="badge badge-blue">{device.layout}</span></td>
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
          Mostrando {filtered.length} de {allDevices.length} dispositivos
        </p>
      </div>
    </div>
  );
}
