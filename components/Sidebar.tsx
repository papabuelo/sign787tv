'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Monitor, Users, Image, ListVideo,
  LayoutTemplate, Megaphone, BarChart2, Settings, Zap,
  ChevronDown, LogOut, Shield, User, Eye
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Dispositivos', href: '/dashboard/devices',    icon: Monitor },
  { label: 'Clientes',     href: '/dashboard/clients',    icon: Users },
  { label: 'Contenido',    href: '/dashboard/content',    icon: Image },
  { label: 'Playlists',    href: '/dashboard/playlists',  icon: ListVideo },
  { label: 'Layouts',      href: '/dashboard/layouts',    icon: LayoutTemplate },
  { label: 'Preview',      href: '/dashboard/preview',    icon: Eye },
  { label: 'Campañas',     href: '/dashboard/campaigns',  icon: Megaphone },
  { label: 'Analytics',    href: '/dashboard/analytics',  icon: BarChart2 },
];

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  client: 'Cliente',
  advertiser: 'Anunciante',
};

const roleColors: Record<string, string> = {
  super_admin: '#3b82f6',
  client: '#10b981',
  advertiser: '#f59e0b',
};

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({ userEmail = '', userName = 'Admin', userRole = 'client' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59,130,246,0.4)'
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '17px', lineHeight: 1 }}>
              SIGN<span style={{ color: '#3b82f6' }}>787</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Digital Signage CRM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        <div style={{ padding: '4px 16px 8px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 0' }}>
        <Link href="/dashboard/settings" className={`sidebar-nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
          <Settings size={17} />
          <span>Configuración</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-nav-item"
          style={{ width: 'calc(100% - 16px)', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <LogOut size={17} />
          <span>Cerrar Sesión</span>
        </button>

        {/* User card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          margin: '8px 8px 0', padding: '10px 12px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: roleColors[userRole] ?? '#64748b', display: 'inline-block' }} />
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                {roleLabel[userRole] ?? userRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
