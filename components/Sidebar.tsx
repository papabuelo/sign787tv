'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Monitor, Users, Image, ListVideo,
  LayoutTemplate, Megaphone, BarChart2, Settings, Zap,
  ChevronDown, LogOut, Shield, User, Eye, Crown, Building
} from 'lucide-react';

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

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({ userEmail = '', userName = 'Admin', userRole = 'super_admin' }: SidebarProps) {
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
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SIGN787</h1>
            <p className="text-xs text-gray-400">Digital Signage CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: roleColors[userRole as keyof typeof roleColors] || '#6b7280' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-gray-400">
              {roleLabel[userRole as keyof typeof roleLabel] || 'Usuario'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}