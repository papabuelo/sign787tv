'use client';

import { useState, useEffect } from 'react';
import { 
  Monitor, Users, LayoutTemplate, Image, Settings, 
  Plus, Edit, Trash2, Eye, Check, X, Clock, Calendar,
  Play, Pause, Upload, Download, Filter, Search,
  ChevronRight, ChevronDown, Grid, List
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

export default function AdminDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'layouts' | 'content' | 'schedule'>('layouts');
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedDeviceForAssignment, setSelectedDeviceForAssignment] = useState<string>('');
  const [selectedLayoutForAssignment, setSelectedLayoutForAssignment] = useState<string>('');
  const [selectedContentForAssignment, setSelectedContentForAssignment] = useState<string>('');
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentFilter, setContentFilter] = useState<'all' | 'images' | 'videos'>('all');

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
      }
    }
  };

  // Función para asignar contenido a cliente/dispositivo
  const handleAssignContent = () => {
    if (selectedContentForAssignment) {
      const content = adminContent.find(c => c.id === selectedContentForAssignment);
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
        }
      }
    }
  };

  // Filtrar contenido según búsqueda y filtros
  const filteredContent = adminContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(contentSearchTerm.toLowerCase()));
    
    const matchesFilter = contentFilter === 'all' || 
                           (contentFilter === 'images' && content.type === 'image') ||
                           (contentFilter === 'videos' && content.type === 'video');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Control Administrativo</h1>
          <p className="text-gray-400">Gestiona todos los layouts y contenido para tus clientes</p>
        </div>

        {/* Filtros y Controles */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Cliente</label>
              <select
                value={selectedClient}
                onChange={(e) => {
                  setSelectedClient(e.target.value);
                  setSelectedDevice('all');
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos los Clientes</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Dispositivo</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                disabled={selectedClient === 'all'}
              >
                <option value="all">Todos los Dispositivos</option>
                {(selectedClient === 'all' ? devices : getDevicesByClient(selectedClient)).map(device => (
                  <option key={device.id} value={device.id}>{device.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowLayoutModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  <span>Asignar Layout</span>
                </button>
                <button
                  onClick={() => setShowContentModal(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span>Asignar Contenido</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('layouts')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'layouts'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-4 h-4 inline mr-2" />
              Layouts Asignados
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'content'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Image className="w-4 h-4 inline mr-2" />
              Contenido Asignado
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Programación
            </button>
          </div>
        </div>

        {/* Contenido según tab activo */}
        {activeTab === 'layouts' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Layouts Asignados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedClient === 'all' ? clients : [clients.find(c => c.id === selectedClient)]).map(client => {
                if (!client) return null;
                const clientDevices = getDevicesByClient(client.id);
                const clientLayouts = getClientAssignedLayouts(client.id);
                
                return (
                  <div key={client.id} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">{client.name}</h3>
                    <div className="space-y-2">
                      {clientDevices.map(device => {
                        const deviceLayout = getDeviceAssignedLayout(client.id, device.id);
                        const layout = layouts.find(l => l.id === deviceLayout?.layoutId);
                        
                        return (
                          <div key={device.id} className="flex items-center justify-between bg-gray-800 rounded p-3">
                            <div>
                              <div className="text-white text-sm font-medium">{device.name}</div>
                              <div className="text-gray-400 text-xs">{device.location}</div>
                              <div className="text-blue-400 text-xs">
                                {layout ? layout.name : 'Sin layout asignado'}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                device.status === 'online' ? 'bg-green-600 text-white' : 
                                device.status === 'warning' ? 'bg-yellow-600 text-white' : 
                                'bg-red-600 text-white'
                              }`}>
                                {device.status}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedDeviceForAssignment(device.id);
                                  setShowLayoutModal(true);
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Contenido Asignado</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar contenido..."
                    value={contentSearchTerm}
                    onChange={(e) => setContentSearchTerm(e.target.value)}
                    className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <select
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value as any)}
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Todo</option>
                  <option value="images">Imágenes</option>
                  <option value="videos">Videos</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredContent.map(content => (
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
                      <button
                        onClick={() => setSelectedContentForAssignment(content.id)}
                        className="text-green-400 hover:text-green-300"
                        title="Asignar a cliente"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Programación de Contenido</h2>
            <div className="text-gray-400">
              <p>Sistema de programación en desarrollo...</p>
              <p className="text-sm mt-2">Próximamente podrás:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>Programar contenido por horarios específicos</li>
                <li>Establecer días de la semana para mostrar contenido</li>
                <li>Crear campañas con fechas de inicio y fin</li>
                <li>Rotar contenido automáticamente</li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal de Asignación de Layout */}
        {showLayoutModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Asignar Layout</h3>
                  <button
                    onClick={() => setShowLayoutModal(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Dispositivo</label>
                    <select
                      value={selectedDeviceForAssignment}
                      onChange={(e) => setSelectedDeviceForAssignment(e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Seleccionar dispositivo</option>
                      {(selectedClient === 'all' ? devices : getDevicesByClient(selectedClient)).map(device => (
                        <option key={device.id} value={device.id}>
                          {device.name} - {device.client}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Layout</label>
                    <select
                      value={selectedLayoutForAssignment}
                      onChange={(e) => setSelectedLayoutForAssignment(e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Seleccionar layout</option>
                      {layouts.map(layout => (
                        <option key={layout.id} value={layout.id}>
                          {layout.name} - {layout.category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleAssignLayout}
                    disabled={!selectedDeviceForAssignment || !selectedLayoutForAssignment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                  >
                    Asignar Layout
                  </button>
                  <button
                    onClick={() => setShowLayoutModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Asignación de Contenido */}
        {showContentModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Asignar Contenido</h3>
                  <button
                    onClick={() => setShowContentModal(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">
                    Selecciona el contenido que quieres asignar al cliente actual:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {adminContent.map(content => (
                    <div key={content.id} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                        {content.type === 'image' ? (
                          <img 
                            src={content.url} 
                            alt={content.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <Play className="w-6 h-6 mx-auto" />
                            <div className="text-xs">{Math.round(content.duration / 1000)}s</div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{content.title}</h4>
                        <p className="text-gray-400 text-sm">{content.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {content.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-600 text-xs rounded text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedContentForAssignment(content.id);
                          handleAssignContent();
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Asignar
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setShowContentModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}