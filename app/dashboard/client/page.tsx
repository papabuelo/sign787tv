'use client';

import { useState, useEffect } from 'react';
import { 
  Monitor, Eye, Play, Settings, 
  Grid, List, Clock, Calendar,
  ChevronRight, CheckCircle, XCircle
} from 'lucide-react';
import { allDevices } from '@/types';
import { getAllLayouts } from '@/lib/layouts';
import { 
  getDeviceAssignedLayout,
  getDeviceActiveContent,
  shouldDisplayContent,
  type ContentItem
} from '@/lib/admin-control';
import Link from 'next/link';

// Simulación de cliente autenticado (en producción vendría de auth)
const currentClientId = 'CLIENT-001'; // Este vendría del sistema de autenticación

export default function ClientDashboard() {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [deviceContent, setDeviceContent] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'devices' | 'content' | 'schedule'>('devices');

  const layouts = getAllLayouts();

  useEffect(() => {
    // Cargar dispositivos del cliente actual
    const clientDevices = allDevices.filter(device => device.clientId === currentClientId);
    setDevices(clientDevices);
    
    if (clientDevices.length > 0 && !selectedDevice) {
      setSelectedDevice(clientDevices[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      // Cargar contenido asignado al dispositivo
      const content = getDeviceActiveContent(currentClientId, selectedDevice);
      setDeviceContent(content);
    }
  }, [selectedDevice]);

  const getDeviceLayout = (deviceId: string) => {
    const assignment = getDeviceAssignedLayout(currentClientId, deviceId);
    return layouts.find(layout => layout.id === assignment?.layoutId);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Panel de Control</h1>
          <p className="text-gray-400">Visualiza tus dispositivos y contenido asignado</p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Dispositivos</p>
                <p className="text-2xl font-bold text-white">{devices.length}</p>
              </div>
              <Monitor className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Contenido Activo</p>
                <p className="text-2xl font-bold text-white">{deviceContent.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Layouts Activos</p>
                <p className="text-2xl font-bold text-white">
                  {devices.filter(d => getDeviceLayout(d.id)).length}
                </p>
              </div>
              <Grid className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Estado General</p>
                <p className="text-lg font-semibold text-green-400">Activo</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex space-x-4 border-b border-gray-700 p-4">
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-4 py-2 font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'devices'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Mis Dispositivos</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'content'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Mi Contenido</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'schedule'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Programación</span>
            </button>
          </div>
        </div>

        {/* Contenido según tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            {/* Selector de Dispositivo */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Seleccionar Dispositivo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map(device => {
                  const deviceLayout = getDeviceLayout(device.id);
                  const isSelected = selectedDevice === device.id;
                  
                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDevice(device.id)}
                      className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-blue-400' : 'hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">{device.name}</h3>
                        <div className={`w-3 h-3 rounded-full ${
                          device.status === 'online' ? 'bg-green-400' :
                          device.status === 'warning' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{device.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 text-sm">
                          {deviceLayout ? deviceLayout.name : 'Sin layout'}
                        </span>
                        <Link
                          href={`/dashboard/preview?deviceId=${device.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Información del Dispositivo Seleccionado */}
            {selectedDevice && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Información del Dispositivo</h2>
                {(() => {
                  const device = devices.find(d => d.id === selectedDevice);
                  const deviceLayout = device ? getDeviceLayout(device.id) : null;
                  
                  if (!device) return null;
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-white font-medium mb-2">{device.name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ubicación:</span>
                            <span className="text-white">{device.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estado:</span>
                            <span className={`${
                              device.status === 'online' ? 'text-green-400' :
                              device.status === 'warning' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {device.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">IP:</span>
                            <span className="text-white">{device.ip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Almacenamiento:</span>
                            <span className="text-white">{device.storage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Versión:</span>
                            <span className="text-white">{device.version}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Layout Asignado</h4>
                        {deviceLayout ? (
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="text-white font-medium mb-1">{deviceLayout.name}</h5>
                            <p className="text-gray-400 text-sm mb-2">{deviceLayout.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Categoría:</span>
                              <span className="text-white">{deviceLayout.category}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Zonas:</span>
                              <span className="text-white">{deviceLayout.zones.length}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-700 rounded-lg p-4 text-center">
                            <div className="text-gray-400 mb-2">Sin layout asignado</div>
                            <p className="text-gray-500 text-sm">Contacta al administrador para asignar un layout</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Mi Contenido Asignado</h2>
            
            {deviceContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-white text-lg mb-2">Sin contenido asignado</h3>
                <p className="text-gray-400">El administrador aún no ha asignado contenido a tus dispositivos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deviceContent.map(content => (
                  <div key={content.id} className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-600 relative">
                      {content.type === 'image' ? (
                        <img 
                          src={content.url} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-400">
                            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Play className="w-6 h-6" />
                            </div>
                            <div className="text-sm">Video</div>
                            <div className="text-xs">{Math.round(content.duration / 1000)}s</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-1">{content.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{content.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {content.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-600 text-xs rounded text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs">
                          {Math.round(content.duration / 1000)}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Programación de Contenido</h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white text-lg mb-2">Programación administrada</h3>
              <p className="text-gray-400">El administrador controla los horarios y días de reproducción del contenido.</p>
              <div className="mt-6 bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-white font-medium mb-2">Información actual:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Horario:</span>
                    <span className="text-white">24/7 (Administrado)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Control:</span>
                    <span className="text-white">Administrador</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}