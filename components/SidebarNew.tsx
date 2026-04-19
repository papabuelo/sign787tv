'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Monitor, Users, Image, ListVideo,
  LayoutTemplate, Megaphone, BarChart2, Settings, Zap,
  ChevronDown, LogOut, Shield, User, Eye, Crown, Building
} from 'lucide-react';
import { Button } from './ui';

// Navegación base - disponible para todos
const baseNavItems = [
  { label: 'Dashboard',    href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Preview',      href: '/dashboard/preview',    icon: Eye },
];

// Navegación de administrador
const adminNavItems = [
  { label: 'Dashboard',    href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Admin',        href: '/dashboard/admin',      icon: Crown },
  { label: 'Dispositivos', href: '/dashboard/devices',    icon: Monitor },
  { label: 'Clientes',     href: '/dashboard/clients',    icon: Users },
  { label: 'Contenido',    href: '/dashboard/content',    icon: Image },
  { label: 'Playlists',    href: '/dashboard/playlists',  icon: ListVideo },
  { label: 'Layouts',      href: '/dashboard/layouts',    icon: LayoutTemplate },
  { label: 'Preview',      href: '/dashboard/preview',    icon: Eye },
  { label: 'Campañas',     href: '/dashboard/campaigns',  icon: Megaphone },
  { label: 'Analytics',    href: '/dashboard/analytics',  icon: BarChart2 },
];

// Navegación de cliente
const clientNavItems = [
  { label: 'Dashboard',    href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Mi Cuenta',    href: '/dashboard/client',    icon: Building },
  { label: 'Dispositivos', href: '/dashboard/devices',    icon: Monitor },
  { label: 'Contenido',    href: '/dashboard/content',    icon: Image },
  { label: 'Playlists',    href: '/dashboard/playlists',  icon: ListVideo },
  { label: 'Preview',      href: '/dashboard/preview',    icon: Eye },
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

interface SidebarNewProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
}

export default function SidebarNew({ userEmail = '', userName = 'Admin', userRole = 'super_admin' }: SidebarNewProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determinar qué items de navegación mostrar según el rol
  const getNavItems = () => {
    switch (userRole) {
      case 'super_admin':
        return adminNavItems;
      case 'client':
        return clientNavItems;
      default:
        return baseNavItems;
    }
  };

  const navItems = getNavItems();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="glass-sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Zap className="w-6 h-6" />
          </div>
          <div className="logo-text">
            <h1 className="logo-title">SIGN787</h1>
            <p className="logo-subtitle">Digital Signage CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {isActive && <div className="nav-indicator" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div 
            className="user-avatar"
            style={{ backgroundColor: roleColors[userRole as keyof typeof roleColors] || '#6b7280' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <p className="user-role">
              {roleLabel[userRole as keyof typeof roleLabel] || 'Usuario'}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          icon={<LogOut size={16} />}
          className="logout-button"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}