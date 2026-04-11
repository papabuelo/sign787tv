'use client';

import Topbar from '@/components/Topbar';
import { Plus, Users, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Client } from '@/types';
import { allClients } from '@/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por ahora usar datos de prueba, después conectaremos a Supabase
    setClients(allClients);
    setLoading(false);
  }, []);

  const totalClients = clients.length;
  const totalDevices = clients.reduce((sum, client) => sum + client.devicesCount, 0);

  return (
    <div>
      <Topbar 
        title="Clientes" 
        subtitle={loading ? 'Cargando clientes...' : `${totalClients} clientes · ${totalDevices} dispositivos totales`} 
      />

      <div style={{ padding: '28px 32px' }}>
        {/* Header con botón de agregar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Gestión de Clientes</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Cada cliente puede tener múltiples dispositivos y playlists
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={15} /> Agregar Cliente
          </button>
        </div>

        {/* Grid de clientes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {clients.map((client) => (
            <div key={client.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Building size={20} color="#60a5fa" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{client.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                    ID: {client.id}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="var(--text-secondary)" />
                  <span style={{ fontSize: '13px' }}>{client.email}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="var(--text-secondary)" />
                  <span style={{ fontSize: '13px' }}>{client.phone}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--text-secondary)" />
                  <span style={{ fontSize: '13px' }}>{client.address}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color="var(--text-secondary)" />
                  <span style={{ fontSize: '13px' }}>Desde {client.createdAt}</span>
                </div>
              </div>

              <div style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid var(--border)',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Dispositivos</p>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: '#60a5fa', margin: 0 }}>
                    {client.devicesCount}
                  </p>
                </div>
                
                <button className="btn-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Building size={48} color="var(--text-secondary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No hay clientes registrados</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Comienza agregando tu primer cliente para gestionar sus dispositivos
            </p>
            <button className="btn-primary">
              <Plus size={15} /> Agregar Primer Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}