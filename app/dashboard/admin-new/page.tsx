'use client';

import { useState, useEffect } from 'react';
import { 
  Monitor, Users, LayoutTemplate, Image, Settings, 
  Plus, Edit, Trash2, Eye, Check, X, Clock, Calendar,
  Play, Pause, Upload, Download, Filter, Search,
  ChevronRight, ChevronDown, Grid, List, TrendingUp,
  Activity, BarChart3, PieChart, Globe, Zap,
  RadioTower, Tv, Film, Music, Camera, BarChart2,
  Wifi, WifiOff, HardDrive, Cpu, Battery, Thermometer,
  Sun, Moon, Bell, BellOff, Mail, Phone, MapPin,
  DollarSign, CreditCard, Package, Truck, Award, Star,
  Heart, Share2, MessageCircle, HelpCircle, Info,
  AlertTriangle, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { allClients, allDevices } from '@/types';
import { getAllLayouts } from '@/lib/layouts';
import { 
  getClientAssignedLayouts, 
  getDeviceAssignedLayout, 
  getClientActiveContent,
  getDeviceActiveContent,
  assignLayoutToClient,
  assignContentToClient,
  removeContentAssignment,
  getAllAdminContent,
  type ContentItem
} from '@/lib/admin-control';
import { Button, Card, Badge, Input, Select, Modal, Tabs } from '@/components/ui';

// Interfaz para estadísticas mejoradas
interface DashboardStats {
  totalClients: number;
  totalDevices: number;
  activeLayouts: number;
  totalContent: number;
  onlineDevices: number;
  offlineDevices: number;
  totalStorage: number;
  usedStorage: number;
  activePlaylists: number;
  monthlyRevenue: number;
  newClientsThisMonth: number;
  systemHealth: number;
  uptime: string;
}

// Interfaz para notificaciones
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AdminDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'layouts' | 'content' | 'analytics'>('overview');
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedDeviceForAssignment, setSelectedDeviceForAssignment] = useState<string>('');
  const [selectedLayoutForAssignment, setSelectedLayoutForAssignment] = useState<string>('');
  const [selectedContentForAssignment, setSelectedContentForAssignment] = useState<string>('');
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentFilter, setContentFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para estadísticas mejoradas
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 12,
    totalDevices: 28,
    activeLayouts: 18,
    totalContent: 156,
    onlineDevices: 24,
    offlineDevices: 4,
    totalStorage: 1000,
    usedStorage: 342,
    activePlaylists: 15,
    monthlyRevenue: 8420,
    newClientsThisMonth: 3,
    systemHealth: 96,
    uptime: '99.9%'
  });

  // Estado para notificaciones
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Dispositivo conectado',
      message: 'Samsung TV 50" en Burger King Centro se ha conectado',
      timestamp: 'Hace 5 minutos',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Espacio de almacenamiento bajo',
      message: 'El dispositivo SUBWAY-001 tiene solo 15% de espacio libre',
      timestamp: 'Hace 15 minutos',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Nueva playlist asignada',
      message: 'Se ha asignado "Promociones Verano" a 3 dispositivos',
      timestamp: 'Hace 1 hora',
      read: true
    }
  ]);

  const clients = allClients;
  const devices = allDevices;
  const layouts = getAllLayouts();
  const adminContent = getAllAdminContent();

  // Función para obtener dispositivos por cliente
  const getDevicesByClient = (clientId: string) => {
    return devices.filter(device => device.clientId === clientId);
  };

  // Función para asignar layout a cliente/dispositivo
  const handleAssignLayout = () => {
    if (selectedDeviceForAssignment && selectedLayoutForAssignment) {
      const device = devices.find(d => d.id === selectedDeviceForAssignment);
      if (device) {
        assignLayoutToClient(
          device.clientId,
          selectedDeviceForAssignment,
          selectedLayoutForAssignment,
          'ADMIN-001'
        );
        setShowLayoutModal(false);
        setSelectedDeviceForAssignment('');
        setSelectedLayoutForAssignment('');
        
        // Agregar notificación
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          title: 'Layout asignado',
          message: `Se ha asignado el layout a ${device.name}`,
          timestamp: 'Ahora',
          read: false
        };
        setNotifications([newNotification, ...notifications]);
      }
    }
  };

  // Función para asignar contenido a cliente/dispositivo
  const handleAssignContent = () => {
    if (selectedContentForAssignment) {
      const content = adminContent.find((c: ContentItem) => c.id === selectedContentForAssignment);
      if (content) {
        // Si hay cliente seleccionado, asignar a ese cliente
        const targetClientId = selectedClient !== 'all' ? selectedClient : clients[0]?.id;
        const targetDeviceId = selectedDevice !== 'all' ? selectedDevice : undefined;
        
        if (targetClientId) {
          assignContentToClient(
            targetClientId,
            selectedContentForAssignment,
            'ADMIN-001',
            targetDeviceId,
            undefined, // layoutZoneId
            {
              displayOrder: 1,
              duration: content.duration
            }
          );
          setShowContentModal(false);
          setSelectedContentForAssignment('');
          
          // Agregar notificación
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'success',
            title: 'Contenido asignado',
            message: `Se ha asignado "${content.title}"`,
            timestamp: 'Ahora',
            read: false
          };
          setNotifications([newNotification, ...notifications]);
        }
      }
    }
  };

  // Filtrar contenido según búsqueda y filtros
  const filteredContent = adminContent.filter((content: ContentItem) => {
    const matchesSearch = content.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
                         content.tags.some((tag: string) => tag.toLowerCase().includes(contentSearchTerm.toLowerCase()));
    
    const matchesFilter = contentFilter === 'all' || 
                           (contentFilter === 'images' && content.type === 'image') ||
                           (contentFilter === 'videos' && content.type === 'video');
    
    return matchesSearch && matchesFilter;
  });

  // Componente de tarjeta de estadísticas mejorada
  const StatsCard = ({ title, value, icon: Icon, trend, color, subtitle }: {
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

  // Componente de gráfico circular para estado de dispositivos
  const DeviceStatusChart = () => {
    const onlinePercentage = (stats.onlineDevices / stats.totalDevices) * 100;
    const offlinePercentage = (stats.offlineDevices / stats.totalDevices) * 100;
    
    return (
      <Card className="glass-card" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Estado de Dispositivos</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span className="text-green-400 text-sm">{stats.onlineDevices} Online</span>
            <div className="w-3 h-3 bg-red-400 rounded-full ml-4" />
            <span className="text-red-400 text-sm">{stats.offlineDevices} Offline</span>
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
              strokeDasharray={`${offlinePercentage * 1.13}, 100`}
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
            <span className="text-red-500 font-medium">{offlinePercentage.toFixed(1)}%</span>
          </div>
        </div>
      </Card>
    );
  };

  // Componente de actividad reciente
  const RecentActivity = () => {
    const recentActivities = [
      {
        id: '1',
        type: 'layout_assigned',
        title: 'Layout asignado',
        description: 'Layout "Menu Board" asignado a Subway Centro',
        time: 'Hace 5 minutos',
        icon: LayoutTemplate,
        color: 'text-blue-400'
      },
      {
        id: '2',
        type: 'content_uploaded',
        title: 'Contenido subido',
        description: '3 nuevas imágenes promocionales para Burger King',
        time: 'Hace 15 minutos',
        icon: Image,
        color: 'text-green-400'
      },
      {
        id: '3',
        type: 'device_connected',
        title: 'Dispositivo conectado',
        description: 'Samsung TV 50" en Demo Client está online',
        time: 'Hace 1 hora',
        icon: Tv,
        color: 'text-purple-400'
      },
      {
        id: '4',
        type: 'playlist_updated',
        title: 'Playlist actualizada',
        description: 'Se actualizó "Promociones Verano" en 2 dispositivos',
        time: 'Hace 2 horas',
        icon: Film,
        color: 'text-orange-400'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Header con gradiente y notificaciones */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Partículas animadas de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Panel de Control</h1>
              <p className="text-blue-100 text-lg">Gestiona todos los layouts y contenido para tus clientes</p>
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
                          Marcar todas como leídas
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          <BellOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No hay notificaciones</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                              !notification.read ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 ${
                                notification.type === 'success' ? 'text-green-400' :
                                notification.type === 'warning' ? 'text-yellow-400' :
                                notification.type === 'error' ? 'text-red-400' :
                                'text-blue-400'
                              }`}>
                                {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                                {notification.type === 'error' && <XCircle className="w-5 h-5" />}
                                {notification.type === 'info' && <Info className="w-5 h-5" />}
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
                <span className="text-white text-sm font-medium">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Navegación con Tabs modernos */}
        <div className="mb-8">
          <Tabs
            tabs={[
              {
                id: 'overview',
                label: 'Resumen',
                content: null
              },
              {
                id: 'layouts',
                label: 'Layouts',
                content: null
              },
              {
                id: 'content',
                label: 'Contenido',
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

        {/* Vista de Resumen */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Estadísticas con cards glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Clientes Totales" 
                value={stats.totalClients} 
                icon={Users} 
                trend={`+${stats.newClientsThisMonth}`} 
                color="text-blue-400"
                subtitle="Este mes"
              />
              <StatsCard 
                title="Dispositivos" 
                value={stats.totalDevices} 
                icon={Monitor} 
                trend={`${stats.onlineDevices} online`} 
                color="text-green-400"
                subtitle={`${stats.offlineDevices} offline`}
              />
              <StatsCard 
                title="Layouts Activos" 
                value={stats.activeLayouts} 
                icon={LayoutTemplate} 
                trend="+15%" 
                color="text-purple-400"
                subtitle="En uso"
              />
              <StatsCard 
                title="Contenido" 
                value={stats.totalContent} 
                icon={Image} 
                trend="+23%" 
                color="text-orange-400"
                subtitle="Elementos"
              />
            </div>

            {/* Segunda fila de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Ingresos Mensuales" 
                value={`$${stats.monthlyRevenue.toLocaleString()}`} 
                icon={DollarSign} 
                trend="+12%" 
                color="text-emerald-400"
                subtitle="USD"
              />
              <StatsCard 
                title="Salud del Sistema" 
                value={`${stats.systemHealth}%`} 
                icon={Heart} 
                trend={stats.uptime} 
                color="text-green-400"
                subtitle="Uptime"
              />
              <StatsCard 
                title="Almacenamiento" 
                value={`${stats.usedStorage}/${stats.totalStorage}GB`} 
                icon={HardDrive} 
                trend={`${((stats.usedStorage / stats.totalStorage) * 100).toFixed(1)}%`} 
                color="text-cyan-400"
                subtitle="Usado"
              />
              <StatsCard 
                title="Playlists Activas" 
                value={stats.activePlaylists} 
                icon={Film} 
                trend="En reproducción" 
                color="text-pink-400"
                subtitle="Activas"
              />
            </div>

            {/* Dashboard principal con gráficos y actividad */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DeviceStatusChart />
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Rendimiento del Sistema</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">CPU Usage</span>
                    <span className="text-white text-sm font-medium">24%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Memory</span>
                    <span className="text-white text-sm font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Network</span>
                    <span className="text-white text-sm font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </Card>
              
              <RecentActivity />
            </div>

            {/* Tabla de dispositivos más activos */}
            <Card className="glass-card" padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Dispositivos Más Activos</h3>
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
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Cliente</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Ubicación</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Estado</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Actividad</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {devices.slice(0, 5).map((device) => {
                      const client = clients.find(c => c.id === device.clientId);
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
                            <div className="text-gray-300">{client?.name || 'Sin cliente'}</div>
                          </td>
                          <td className="py-4">
                            <div className="text-gray-400 text-sm">{device.location}</div>
                          </td>
                          <td className="py-4">
                            <Badge variant={isOnline ? 'success' : 'error'}>
                              {device.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-1">
                                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '75%' }} />
                              </div>
                              <span className="text-gray-400 text-xs">75%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Settings className="w-4 h-4" />
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

        {/* Vista de Layouts */}
        {activeTab === 'layouts' && (
          <div className="space-y-6 animate-fade-in">
            {/* Controles superiores */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <Select
                    value={selectedClient}
                    onChange={(e) => {
                      setSelectedClient(e.target.value);
                      setSelectedDevice('all');
                    }}
                    className="min-w-48"
                  >
                    <option value="all">Todos los Clientes</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <Select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="min-w-48"
                    disabled={selectedClient === 'all'}
                  >
                    <option value="all">Todos los Dispositivos</option>
                    {(selectedClient === 'all' ? devices : getDevicesByClient(selectedClient)).map(device => (
                      <option key={device.id} value={device.id}>{device.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowLayoutModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Asignar Layout
              </Button>
            </div>

            {/* Grid de layouts asignados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedClient === 'all' ? clients : [clients.find(c => c.id === selectedClient)]).map(client => {
                if (!client) return null;
                const clientDevices = getDevicesByClient(client.id);
                const clientLayouts = getClientAssignedLayouts(client.id);
                
                return (
                  <Card key={client.id} className="glass-card" padding="lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">{client.name}</h3>
                      <Badge variant="outline">{clientDevices.length} dispositivos</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {clientDevices.map(device => {
                        const deviceLayout = getDeviceAssignedLayout(client.id, device.id);
                        const layout = layouts.find((l: any) => l.id === deviceLayout?.layoutId);
                        const isOnline = device.status === 'online';
                        
                        return (
                          <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                              <div>
                                <div className="text-white text-sm font-medium">{device.name}</div>
                                <div className="text-gray-400 text-xs">{device.location}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-blue-400 text-xs">{layout ? layout.name : 'Sin layout'}</div>
                              <Badge variant={isOnline ? 'success' : 'error'} size="sm">
                                {device.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista de Contenido */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in">
            {/* Controles de búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar contenido..."
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
                  <option value="all">Todo</option>
                  <option value="images">Imágenes</option>
                  <option value="videos">Videos</option>
                </Select>
              </div>
              
              <Button 
                onClick={() => setShowContentModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Asignar Contenido
              </Button>
            </div>

            {/* Grid de contenido con diseño moderno */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map((content: ContentItem) => (
                <Card key={content.id} className="glass-card hover:scale-105 transition-all duration-300 group" padding="none">
                  {/* Preview de contenido */}
                  <div className="aspect-video relative overflow-hidden rounded-t-xl">
                    {content.type === 'image' ? (
                      <img 
                        src={content.url} 
                        alt={content.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <Film className="w-12 h-12 text-gray-400 mx-auto mb-2" />
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
                      <span>{(content.size / 1024 / 1024).toFixed(1)} MB</span>
                      <span>{new Date(content.uploadedAt).toLocaleDateString()}</span>
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
            
            {filteredContent.length === 0 && (
              <Card className="glass-card" padding="lg">
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No se encontró contenido</h3>
                  <p className="text-gray-400">Intenta con otros términos de búsqueda o filtros</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Vista de Analíticas */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Reproducciones</h3>
                  <Play className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">24,567</div>
                <div className="text-green-400 text-sm">+18.2% este mes</div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Tiempo de Visualización</h3>
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">2.4h</div>
                <div className="text-green-400 text-sm">+5.3% este mes</div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Interacciones</h3>
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">1,234</div>
                <div className="text-green-400 text-sm">+12.7% este mes</div>
              </Card>
              
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Conversiones</h3>
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">8.5%</div>
                <div className="text-green-400 text-sm">+2.1% este mes</div>
              </Card>
            </div>
            
            {/* Gráficos de rendimiento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Reproducciones por Hora</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Simulación de gráfico de barras */}
                <div className="h-48 flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 95, 70, 85, 60, 75, 90, 55, 70].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
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
                    { name: 'Promoción Hamburguesas', plays: 1234, trend: '+15%' },
                    { name: 'Menú del Día', plays: 987, trend: '+8%' },
                    { name: 'Oferta Especial', plays: 756, trend: '+23%' },
                    { name: 'Bebidas Refrescantes', plays: 543, trend: '-5%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-gray-400 text-sm">{item.plays} reproducciones</div>
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

      {/* Modales */}
      <Modal
        isOpen={showLayoutModal}
        onClose={() => setShowLayoutModal(false)}
        title="Asignar Layout"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Dispositivo</label>
            <Select
              value={selectedDeviceForAssignment}
              onChange={(e) => setSelectedDeviceForAssignment(e.target.value)}
            >
              <option value="">Seleccionar dispositivo</option>
              {(selectedClient === 'all' ? devices : getDevicesByClient(selectedClient)).map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} - {device.client}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Layout</label>
            <Select
              value={selectedLayoutForAssignment}
              onChange={(e) => setSelectedLayoutForAssignment(e.target.value)}
            >
              <option value="">Seleccionar layout</option>
              {layouts.map((layout: any) => (
                <option key={layout.id} value={layout.id}>
                  {layout.name} - {layout.category}
                </option>
              ))}
            </Select>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Button
            onClick={handleAssignLayout}
            disabled={!selectedDeviceForAssignment || !selectedLayoutForAssignment}
            className="flex-1"
          >
            Asignar Layout
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowLayoutModal(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        title="Asignar Contenido"
        size="lg"
      >
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            Selecciona el contenido que quieres asignar al cliente actual:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {adminContent.map((content: ContentItem) => (
            <div
              key={content.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedContentForAssignment === content.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
              }`}
              onClick={() => setSelectedContentForAssignment(content.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                  {content.type === 'image' ? (
                    <img 
                      src={content.url} 
                      alt={content.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Film className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{content.title}</div>
                  <div className="text-gray-400 text-xs">{content.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" size="sm">
                      {content.type === 'image' ? 'Imagen' : 'Video'}
                    </Badge>
                    <span className="text-gray-500 text-xs">{Math.round(content.duration / 1000)}s</span>
                  </div>
                </div>
                {selectedContentForAssignment === content.id && (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Button
            onClick={handleAssignContent}
            disabled={!selectedContentForAssignment}
            className="flex-1"
          >
            Asignar Contenido
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowContentModal(false)}
            className="flex-1"
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
}