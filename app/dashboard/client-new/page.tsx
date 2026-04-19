'use client';

import { useState, useEffect } from 'react';
import { 
  Monitor, LayoutTemplate, Image, Settings, 
  Eye, Clock, TrendingUp, Activity, BarChart3, 
  Wifi, WifiOff, Play, Pause, Calendar,
  Star, Heart, Share2, MessageCircle, Bell,
  ChevronRight, ChevronDown, Grid, List, Search, Info, Plus
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { allClients, allDevices } from '@/types';
import { getClientAssignedLayouts, getDeviceActiveContent } from '@/lib/admin-control';
import { getAllLayouts } from '@/lib/layouts';
import { Button, Card, Badge, Input, Select, Modal, Tabs } from '@/components/ui';

// Interfaz para estadísticas del cliente
interface ClientStats {
  totalDevices: number;
  onlineDevices: number;
  activeLayouts: number;
  totalContent: number;
  monthlyViews: number;
  engagementRate: number;
  storageUsed: number;
  storageTotal: number;
}

// Interfaz para notificaciones del cliente
interface ClientNotification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function ClientDashboard() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId') || 'demo-client-001';
  
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'content' | 'analytics'>('overview');
  const [showLayoutPreview, setShowLayoutPreview] = useState(false);
  const [selectedLayoutForPreview, setSelectedLayoutForPreview] = useState<string>('');
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentFilter, setContentFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estado para estadísticas del cliente
  const [stats, setStats] = useState<ClientStats>({
    totalDevices: 3,
    onlineDevices: 2,
    activeLayouts: 2,
    totalContent: 15,
    monthlyViews: 8420,
    engagementRate: 78,
    storageUsed: 45,
    storageTotal: 100
  });

  // Estado para notificaciones del cliente
  const [notifications, setNotifications] = useState<ClientNotification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Nuevo contenido asignado',
      message: 'Se han agregado 3 nuevas imágenes promocionales a tu cuenta',
      timestamp: 'Hace 2 horas',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Layout actualizado',
      message: 'Tu layout "Menu Principal" ha sido actualizado por el administrador',
      timestamp: 'Hace 5 horas',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Dispositivo desconectado',
      message: 'El dispositivo Samsung TV 50" en ubicación Centro está offline',
      timestamp: 'Hace 1 día',
      read: true
    }
  ]);

  const currentClient = allClients.find(client => client.id === clientId);
  const clientDevices = allDevices.filter(device => device.clientId === clientId);
  const clientLayouts = getClientAssignedLayouts(clientId);
  const allLayouts = getAllLayouts();

  // Función para obtener contenido activo del dispositivo
  const getDeviceContent = (deviceId: string) => {
    return getDeviceActiveContent(clientId, deviceId);
  };

  // Componente de tarjeta de estadísticas para cliente
  const ClientStatsCard = ({ title, value, icon: Icon, trend, color, subtitle }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color: string;
    subtitle?: string;
  }) => {
    return (
      <Card className="glass-card hover:scale-105 transition-all duration-300" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center text-green-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-gray-400 text-sm">{title}</div>
          {subtitle && (
            <div className="text-gray-500 text-xs">{subtitle}</div>
          )}
        </div>
      </Card>
    );
  };

  // Componente de estado de dispositivos para cliente
  const ClientDeviceStatus = () => {
    const onlinePercentage = (stats.onlineDevices / stats.totalDevices) * 100;
    const offlineDevices = stats.totalDevices - stats.onlineDevices;
    
    return (
      <Card className="glass-card" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Mis Dispositivos</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span className="text-green-400 text-sm">{stats.onlineDevices} Online</span>
            <div className="w-3 h-3 bg-red-400 rounded-full ml-4" />
            <span className="text-red-400 text-sm">{offlineDevices} Offline</span>
          </div>
        </div>
        
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-green-500"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${onlinePercentage * 1.13}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-red-500"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${(100 - onlinePercentage) * 1.13}, 100`}
              strokeDashoffset={-onlinePercentage * 1.13}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalDevices}</div>
              <div className="text-gray-400 text-xs">Total</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-300 text-sm">Online</span>
            </div>
            <span className="text-green-500 font-medium">{onlinePercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-300 text-sm">Offline</span>
            </div>
            <span className="text-red-500 font-medium">{(100 - onlinePercentage).toFixed(1)}%</span>
          </div>
        </div>
      </Card>
    );
  };

  // Componente de actividad reciente para cliente
  const ClientRecentActivity = () => {
    const recentActivities = [
      {
        id: '1',
        type: 'content_assigned',
        title: 'Nuevo contenido',
        description: '3 imágenes promocionales agregadas a tu cuenta',
        time: 'Hace 2 horas',
        icon: Image,
        color: 'text-blue-400'
      },
      {
        id: '2',
        type: 'layout_updated',
        title: 'Layout actualizado',
        message: 'Tu menú principal fue actualizado',
        time: 'Hace 5 horas',
        icon: LayoutTemplate,
        color: 'text-purple-400'
      },
      {
        id: '3',
        type: 'device_status',
        title: 'Estado del dispositivo',
        description: 'Samsung TV Centro está offline',
        time: 'Hace 1 día',
        icon: Monitor,
        color: 'text-red-400'
      }
    ];

    return (
      <Card className="glass-card" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Actividad Reciente</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                <div className={`p-2 rounded-lg bg-white/10 ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{activity.title}</div>
                  <div className="text-gray-400 text-xs mt-1">{activity.description}</div>
                  <div className="text-gray-500 text-xs mt-2">{activity.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header del Cliente con gradiente */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Partículas animadas de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{currentClient?.name || 'Mi Cuenta'}</h1>
              <p className="text-purple-100 text-lg">Panel de control de dispositivos y contenido</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Botón de notificaciones */}
              <div className="relative">
                <Button
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {notifications.filter(n => !n.read).length}
                    </div>
                  )}
                </Button>
                
                {/* Panel de notificaciones */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 animate-scale-in">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Notificaciones</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        >
                          Marcar todas
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No hay notificaciones</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                              !notification.read ? 'bg-purple-900/20 border-l-4 border-purple-500' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 ${
                                notification.type === 'success' ? 'text-green-400' :
                                notification.type === 'warning' ? 'text-yellow-400' :
                                'text-purple-400'
                              }`}>
                                {notification.type === 'success' && <Star className="w-5 h-5" />}
                                {notification.type === 'warning' && <MessageCircle className="w-5 h-5" />}
                                {notification.type === 'info' && <Bell className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="text-white font-medium text-sm">{notification.title}</div>
                                <div className="text-gray-400 text-xs mt-1">{notification.message}</div>
                                <div className="text-gray-500 text-xs mt-2">{notification.timestamp}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Button variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
                Configuración
              </Button>
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Servicio Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Navegación con Tabs modernos para cliente */}
        <div className="mb-8">
          <Tabs
            tabs={[
              {
                id: 'overview',
                label: 'Resumen',
                content: null
              },
              {
                id: 'devices',
                label: 'Mis Dispositivos',
                content: null
              },
              {
                id: 'content',
                label: 'Mi Contenido',
                content: null
              },
              {
                id: 'analytics',
                label: 'Analíticas',
                content: null
              }
            ]}
            defaultTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as any)}
            className="glass-card"
          />
        </div>

        {/* Vista de Resumen para Cliente */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Estadísticas principales del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ClientStatsCard 
                title="Mis Dispositivos" 
                value={stats.totalDevices} 
                icon={Monitor} 
                trend={`${stats.onlineDevices} online`} 
                color="text-purple-400"
                subtitle={`${stats.totalDevices - stats.onlineDevices} offline`}
              />
              <ClientStatsCard 
                title="Layouts Activos" 
                value={stats.activeLayouts} 
                icon={LayoutTemplate} 
                trend="Asignados" 
                color="text-blue-400"
                subtitle="Por admin"
              />
              <ClientStatsCard 
                title="Mi Contenido" 
                value={stats.totalContent} 
                icon={Image} 
                trend="Elementos" 
                color="text-green-400"
                subtitle="Aprobados"
              />
              <ClientStatsCard 
                title="Vistas Mensuales" 
                value={stats.monthlyViews.toLocaleString()} 
                icon={TrendingUp} 
                trend="+12%" 
                color="text-orange-400"
                subtitle="Este mes"
              />
            </div>

            {/* Segunda fila de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ClientStatsCard 
                title="Engagement" 
                value={`${stats.engagementRate}%`} 
                icon={Heart} 
                trend="Bueno" 
                color="text-pink-400"
                subtitle="Interacción"
              />
              <ClientStatsCard 
                title="Almacenamiento" 
                value={`${stats.storageUsed}/${stats.storageTotal}GB`} 
                icon={BarChart3} 
                trend={`${((stats.storageUsed / stats.storageTotal) * 100).toFixed(1)}%`} 
                color="text-cyan-400"
                subtitle="Usado"
              />
              <ClientStatsCard 
                title="Dispositivos Online" 
                value={stats.onlineDevices} 
                icon={Wifi} 
                trend="Activos" 
                color="text-emerald-400"
                subtitle="Conectados"
              />
              <ClientStatsCard 
                title="Soporte Técnico" 
                value="24/7" 
                icon={MessageCircle} 
                trend="Activo" 
                color="text-yellow-400"
                subtitle="Disponible"
              />
            </div>

            {/* Dashboard principal con gráficos y actividad */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ClientDeviceStatus />
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Rendimiento de Contenido</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Tasa de Interacción</span>
                    <span className="text-white text-sm font-medium">{stats.engagementRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.engagementRate}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Visualizaciones</span>
                    <span className="text-white text-sm font-medium">{stats.monthlyViews.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Tiempo de Visualización</span>
                    <span className="text-white text-sm font-medium">2.4h</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </Card>
              
              <ClientRecentActivity />
            </div>

            {/* Tabla de dispositivos del cliente */}
            <Card className="glass-card" padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Mis Dispositivos</h3>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver todos
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Dispositivo</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Ubicación</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Layout</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Estado</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Actividad</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {clientDevices.map((device) => {
                      const deviceLayout = clientLayouts.find((l: any) => l.deviceId === device.id);
                      const layout = allLayouts.find((l: any) => l.id === deviceLayout?.layoutId);
                      const isOnline = device.status === 'online';
                      
                      return (
                        <tr key={device.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                              <div>
                                <div className="text-white font-medium">{device.name}</div>
                                <div className="text-gray-400 text-xs">{device.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="text-gray-300">{device.location}</div>
                          </td>
                          <td className="py-4">
                            <div className="text-purple-400 text-sm">{layout ? layout.name : 'Por asignar'}</div>
                          </td>
                          <td className="py-4">
                            <Badge variant={isOnline ? 'success' : 'error'}>
                              {device.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-1">
                                <div className="bg-purple-500 h-1 rounded-full" style={{ width: '75%' }} />
                              </div>
                              <span className="text-gray-400 text-xs">75%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => {
                                setSelectedLayoutForPreview(layout?.id || '');
                                setShowLayoutPreview(true);
                              }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Play className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Vista de Dispositivos */}
        {activeTab === 'devices' && (
          <div className="space-y-6 animate-fade-in">
            {/* Controles superiores */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <Select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="min-w-48"
                  >
                    <option value="all">Todos mis dispositivos</option>
                    {clientDevices.map(device => (
                      <option key={device.id} value={device.id}>{device.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowLayoutPreview(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Previsualizar Layout
              </Button>
            </div>

            {/* Grid de dispositivos del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedDevice === 'all' ? clientDevices : [clientDevices.find(d => d.id === selectedDevice)]).map(device => {
                if (!device) return null;
                const deviceLayout = clientLayouts.find((l: any) => l.deviceId === device.id);
                const layout = allLayouts.find((l: any) => l.id === deviceLayout?.layoutId);
                const isOnline = device.status === 'online';
                
                return (
                  <Card key={device.id} className="glass-card" padding="lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <h3 className="text-white font-semibold">{device.name}</h3>
                          <p className="text-gray-400 text-sm">{device.location}</p>
                        </div>
                      </div>
                      <Badge variant={isOnline ? 'success' : 'error'}>
                        {device.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Layout asignado:</span>
                        <span className="text-purple-400 text-sm font-medium">
                          {layout ? layout.name : 'Por asignar'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Última actualización:</span>
                        <span className="text-gray-300 text-sm">Hace 2 horas</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Contenido activo:</span>
                        <span className="text-green-400 text-sm">{getDeviceContent(device.id)?.length || 0} elementos</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedLayoutForPreview(layout?.id || '');
                          setShowLayoutPreview(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Layout
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        disabled={!isOnline}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista de Contenido del Cliente */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in">
            {/* Controles de búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar en mi contenido..."
                    value={contentSearchTerm}
                    onChange={(e) => setContentSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value as any)}
                  className="min-w-32"
                >
                  <option value="all">Todo mi contenido</option>
                  <option value="images">Mis Imágenes</option>
                  <option value="videos">Mis Videos</option>
                </Select>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Solicitar Contenido
              </Button>
            </div>

            {/* Mensaje informativo */}
            <Card className="glass-card" padding="lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Contenido Administrado</h3>
                  <p className="text-gray-400 text-sm">
                    Todo el contenido que ves aquí ha sido cuidadosamente seleccionado y aprobado por nuestro equipo administrativo para tu negocio.
                    Si necesitas contenido adicional o personalizado, puedes solicitarlo a través del botón "Solicitar Contenido".
                  </p>
                </div>
              </div>
            </Card>

            {/* Grid de contenido del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Contenido de ejemplo - en producción esto vendría del admin-control */}
              {[
                { id: '1', title: 'Promoción Hamburguesas', type: 'image', description: 'Promoción especial de hamburguesas', tags: ['comida', 'promocion'], duration: 5000 },
                { id: '2', title: 'Menú del Día', type: 'image', description: 'Menú diario actualizado', tags: ['menu', 'diario'], duration: 8000 },
                { id: '3', title: 'Bebidas Refrescantes', type: 'video', description: 'Video promocional de bebidas', tags: ['bebidas', 'video'], duration: 15000 },
                { id: '4', title: 'Oferta Especial', type: 'image', description: 'Oferta especial del mes', tags: ['oferta', 'especial'], duration: 6000 }
              ].map(content => (
                <Card key={content.id} className="glass-card hover:scale-105 transition-all duration-300 group" padding="none">
                  {/* Preview de contenido */}
                  <div className="aspect-video relative overflow-hidden rounded-t-xl">
                    {content.type === 'image' ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <div className="text-gray-400 text-sm">Imagen</div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <div className="text-gray-400 text-sm">Video</div>
                          <div className="text-gray-500 text-xs">{Math.round(content.duration / 1000)}s</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay con información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" size="sm">
                            {content.type === 'image' ? 'Imagen' : 'Video'}
                          </Badge>
                          <div className="text-white text-xs">
                            {Math.round(content.duration / 1000)}s
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Información del contenido */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{content.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{content.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {content.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 3 && (
                        <Badge variant="outline" size="sm">
                          +{content.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Metadatos */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Aprobado por admin</span>
                      <span>Asignado</span>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Vista Previa
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Vista de Analíticas del Cliente */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            {/* Métricas principales del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Visualizaciones</h3>
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.monthlyViews.toLocaleString()}</div>
                <div className="text-green-400 text-sm">+15% este mes</div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Interacciones</h3>
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.engagementRate}%</div>
                <div className="text-green-400 text-sm">+8% este mes</div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Tiempo Promedio</h3>
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">2.4h</div>
                <div className="text-green-400 text-sm">+5% este mes</div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Alcance</h3>
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">12.5K</div>
                <div className="text-green-400 text-sm">+23% este mes</div>
              </Card>
            </div>
            
            {/* Gráficos de rendimiento del cliente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Visualizaciones por Hora</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Simulación de gráfico de barras */}
                <div className="h-48 flex items-end justify-between gap-2">
                  {[30, 45, 35, 70, 85, 60, 75, 50, 65, 80, 45, 60].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-gray-400 text-xs mt-2">{index + 8}h</div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Contenido Más Popular</h3>
                  <Star className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Promoción Hamburguesas', views: 1234, trend: '+15%' },
                    { name: 'Menú del Día', views: 987, trend: '+8%' },
                    { name: 'Oferta Especial', views: 756, trend: '+23%' },
                    { name: 'Bebidas Refrescantes', views: 543, trend: '-5%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-gray-400 text-sm">{item.views.toLocaleString()} vistas</div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">{item.trend}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Previsualización de Layout */}
      <Modal
        isOpen={showLayoutPreview}
        onClose={() => setShowLayoutPreview(false)}
        title="Previsualizar Layout"
        size="xl"
      >
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50" />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <LayoutTemplate className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Vista Previa del Layout</h3>
                <p className="text-gray-300 text-sm">
                  Este es un ejemplo de cómo se verá tu layout en el dispositivo seleccionado.
                  El contenido se mostrará según la configuración asignada por el administrador.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Zona Principal</h4>
              <p className="text-gray-400 text-sm">Contenido principal y promociones</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Zona Secundaria</h4>
              <p className="text-gray-400 text-sm">Información adicional y menús</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Button
            onClick={() => setShowLayoutPreview(false)}
            className="flex-1"
          >
            Cerrar Vista Previa
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              // Aquí podrías implementar una vista de pantalla completa
              setShowLayoutPreview(false);
            }}
            className="flex-1"
          >
            Vista de Pantalla Completa
          </Button>
        </div>
      </Modal>
    </div>
  );
}