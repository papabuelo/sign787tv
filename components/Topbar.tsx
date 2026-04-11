'use client';

import { Bell, Search, RefreshCw } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      background: 'rgba(8, 11, 20, 0.7)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar..."
            style={{
              width: '220px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '9px 14px 9px 34px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Refresh */}
        <button style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
          transition: 'all 0.2s'
        }}>
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
          transition: 'all 0.2s', position: 'relative'
        }}>
          <Bell size={15} />
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 6px rgba(239,68,68,0.8)'
          }} />
        </button>
      </div>
    </header>
  );
}
