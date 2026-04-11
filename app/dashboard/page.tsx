'use client';

import Topbar from '@/components/Topbar';
import {
  Monitor, Users, Wifi, WifiOff, TrendingUp, Play,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2,
  Activity, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const statsData = [
  {
    label: 'Dispositivos Activos', value: '847', change: '+12', positive: true,
    sub: 'de 1,024 totales', icon: Monitor, color: '#3b82f6', glow: '#3b82f6'
  },
  {
    label: 'Clientes', value: '143', change: '+5', positive: true,
    sub: 'este mes', icon: Users, color: '#8b5cf6', glow: '#8b5cf6'
  },
  {
    label: 'Online Ahora', value: '791', change: '-3', positive: false,
    sub: 'en los últimos 5 min', icon: Wifi, color: '#10b981', glow: '#10b981'
  },
  {
    label: 'Impresiones Hoy', value: '48.2K', change: '+18%', positive: true,
    sub: 'anuncios reproducidos', icon: Play, color: '#f59e0b', glow: '#f59e0b'
  },
];

const activityChartData = [
  { time: '06:00', online: 220, plays: 1400 },
  { time: '07:00', online: 480, plays: 3200 },
  { time: '08:00', online: 670, plays: 5100 },
  { time: '09:00', online: 740, plays: 6800 },
  { time: '10:00', online: 780, plays: 7200 },
  { time: '11:00', online: 791, plays: 7900 },
  { time: '12:00', online: 770, plays: 8100 },
  { time: '13:00', online: 760, plays: 7600 },
  { time: '14:00', online: 791, plays: 8300 },
];

const recentAlerts = [
  { id: 1, type: 'offline', device: 'TV-Plaza-Mall-03', client: 'Plaza Mall Centro', time: 'hace 4 min' },
  { id: 2, type: 'offline', device: 'TV-Subway-401', client: 'Subway Hato Rey', time: 'hace 12 min' },
  { id: 3, type: 'ok', device: 'TV-McD-Santurce-01', client: "McDonald's Santurce", time: 'hace 18 min' },
  { id: 4, type: 'warning', device: 'TV-Walmart-Caguas-02', client: 'Walmart Caguas', time: 'hace 25 min' },
];

const recentDevices = [
  { id: 'FS-001', name: 'TV-Entrada-Principal', client: 'Burger King Bayamón', status: 'online', layout: 'Full Screen', uptime: '99.2%' },
  { id: 'FS-002', name: 'TV-Caja-Registradora', client: 'Subway Plaza', status: 'online', layout: '4 Zonas', uptime: '97.8%' },
  { id: 'FS-003', name: 'TV-Sala-Espera', client: 'Clínica Médica Norte', status: 'offline', layout: '3 Paneles', uptime: '81.0%' },
  { id: 'FS-004', name: 'TV-Vitrina-Exterior', client: 'Walgreens Río Piedras', status: 'online', layout: '2-Split', uptime: '98.5%' },
  { id: 'FS-005', name: 'TV-Lobby', client: 'Banco Popular Santurce', status: 'warning', layout: 'Full Screen', uptime: '92.1%' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px', padding: '10px 14px', fontSize: '12px'
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div>
      <Topbar title="Dashboard" subtitle="Bienvenido, aquí está el resumen de tu red." />

      <div style={{ padding: '28px 32px' }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: `rgba(${stat.color === '#3b82f6' ? '59,130,246' : stat.color === '#8b5cf6' ? '139,92,246' : stat.color === '#10b981' ? '16,185,129' : '245,158,11'}, 0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${stat.color}22`
                  }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '3px',
                    fontSize: '12px', fontWeight: 600,
                    color: stat.positive ? '#34d399' : '#f87171'
                  }}>
                    {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Chart + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '18px', marginBottom: '28px' }}>

          {/* Area Chart */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Actividad de Red — Hoy</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Dispositivos online e impresiones por hora
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '10px', height: '3px', background: '#3b82f6', borderRadius: '2px', display: 'inline-block' }} />
                  Dispositivos
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '10px', height: '3px', background: '#8b5cf6', borderRadius: '2px', display: 'inline-block' }} />
                  Plays
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityChartData}>
                <defs>
                  <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="online" name="Online" stroke="#3b82f6" strokeWidth={2} fill="url(#colorOnline)" />
                <Area type="monotone" dataKey="plays" name="Plays" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorPlays)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Alertas Recientes</h3>
              <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                2 activas
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentAlerts.map((alert) => (
                <div key={alert.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '12px', borderRadius: '10px',
                  background: alert.type === 'offline' ? 'rgba(239,68,68,0.06)' :
                               alert.type === 'warning' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)',
                  border: `1px solid ${alert.type === 'offline' ? 'rgba(239,68,68,0.15)' : alert.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'}`
                }}>
                  {alert.type === 'offline' ? <WifiOff size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} /> :
                   alert.type === 'warning' ? <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '1px' }} /> :
                   <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '1px' }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {alert.device}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.client}</p>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {alert.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Devices Table */}
        <div className="glass-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Dispositivos Recientes</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Últimos dispositivos con actividad</p>
            </div>
            <a href="/dashboard/devices" style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Ver todos <ArrowUpRight size={14} />
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dispositivo</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Layout Activo</th>
                  <th>Uptime</th>
                </tr>
              </thead>
              <tbody>
                {recentDevices.map((device) => (
                  <tr key={device.id} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{device.id}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{device.name}</td>
                    <td>{device.client}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`status-dot ${device.status === 'online' ? 'status-online' : device.status === 'offline' ? 'status-offline' : 'status-warning'}`} />
                        <span style={{
                          fontSize: '12px', fontWeight: 600,
                          color: device.status === 'online' ? '#34d399' : device.status === 'offline' ? '#64748b' : '#fbbf24'
                        }}>
                          {device.status === 'online' ? 'Online' : device.status === 'offline' ? 'Offline' : 'Alerta'}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-blue">{device.layout}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="progress-bar" style={{ width: '70px' }}>
                          <div className="progress-fill" style={{
                            width: device.uptime,
                            background: parseFloat(device.uptime) > 95 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                                        parseFloat(device.uptime) > 85 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                        'linear-gradient(90deg, #ef4444, #f87171)'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                          {device.uptime}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
