'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Settings, Grid, Monitor, Save, X, Check, Copy, Download } from 'lucide-react';
import { getAllLayouts, getLayoutsByCategory, createCustomLayout, type LayoutConfig, type LayoutZone } from '@/lib/layouts';

export default function LayoutsManager() {
  const [layouts, setLayouts] = useState<LayoutConfig[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLayout, setSelectedLayout] = useState<LayoutConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingZone, setEditingZone] = useState<LayoutZone | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['all', 'standard', 'retail', 'restaurant', 'corporate', 'custom'];

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = () => {
    const allLayouts = getAllLayouts();
    setLayouts(selectedCategory === 'all' ? allLayouts : getLayoutsByCategory(selectedCategory));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const allLayouts = getAllLayouts();
    setLayouts(category === 'all' ? allLayouts : getLayoutsByCategory(category));
  };

  const handleEditLayout = (layout: LayoutConfig) => {
    setSelectedLayout({ ...layout });
    setIsEditing(true);
  };

  const handleSaveLayout = () => {
    if (selectedLayout) {
      // Aquí guardarías el layout en tu base de datos o estado global
      console.log('Guardando layout:', selectedLayout);
      setIsEditing(false);
      setSelectedLayout(null);
      loadLayouts();
    }
  };

  const handleCreateLayout = () => {
    const newLayout = createCustomLayout({
      name: 'Nuevo Layout',
      description: 'Layout personalizado',
      zones: [
        {
          id: 'main',
          x: 0,
          y: 0,
          w: 100,
          h: 100,
          color: '#3b82f6',
          label: 'Zona Principal'
        }
      ],
      tags: ['personalizado']
    });
    setSelectedLayout(newLayout);
    setIsEditing(true);
  };

  const handleDuplicateLayout = (layout: LayoutConfig) => {
    const duplicatedLayout = createCustomLayout({
      name: `${layout.name} (Copia)`,
      description: layout.description,
      zones: layout.zones.map((zone: LayoutZone) => ({ ...zone })),
      aspectRatio: layout.aspectRatio,
      tags: [...layout.tags]
    });
    setSelectedLayout(duplicatedLayout);
    setIsEditing(true);
  };

  const updateZoneProperty = (zoneId: string, property: keyof LayoutZone, value: any) => {
    if (selectedLayout) {
      setSelectedLayout({
        ...selectedLayout,
        zones: selectedLayout.zones.map((zone: LayoutZone) =>
          zone.id === zoneId ? { ...zone, [property]: value } : zone
        )
      });
    }
  };

  const addNewZone = () => {
    if (selectedLayout) {
      const newZone: LayoutZone = {
        id: `zone-${Date.now()}`,
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        color: '#6b7280',
        label: 'Nueva Zona',
        type: 'secondary',
        contentType: 'mixed',
        maxContentItems: 3,
        autoRotate: true,
        rotationInterval: 5000
      };
      setSelectedLayout({
        ...selectedLayout,
        zones: [...selectedLayout.zones, newZone]
      });
    }
  };

  const removeZone = (zoneId: string) => {
    if (selectedLayout && selectedLayout.zones.length > 1) {
      setSelectedLayout({
        ...selectedLayout,
        zones: selectedLayout.zones.filter((zone: LayoutZone) => zone.id !== zoneId)
      });
    }
  };

  const ZoneEditor = ({ zone, onUpdate, onRemove }: { zone: LayoutZone; onUpdate: (prop: keyof LayoutZone, value: any) => void; onRemove: () => void }) => {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-medium">{zone.label}</h4>
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors"
            disabled={false} // Siempre permitir remover en UI
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Etiqueta</label>
            <input
              type="text"
              value={zone.label}
              onChange={(e) => onUpdate('label', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Color</label>
            <input
              type="color"
              value={zone.color}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="w-full h-10 bg-gray-700 rounded border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Posición X (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={zone.x}
              onChange={(e) => onUpdate('x', parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Posición Y (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={zone.y}
              onChange={(e) => onUpdate('y', parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Ancho (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={zone.w}
              onChange={(e) => onUpdate('w', parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Alto (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={zone.h}
              onChange={(e) => onUpdate('h', parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Tipo de Zona</label>
            <select
              value={zone.type}
              onChange={(e) => onUpdate('type', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="main">Principal</option>
              <option value="secondary">Secundaria</option>
              <option value="ticker">Ticker/Banner</option>
              <option value="side">Lateral</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Tipo de Contenido</label>
            <select
              value={zone.contentType}
              onChange={(e) => onUpdate('contentType', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="mixed">Mixto (Imágenes y Videos)</option>
              <option value="image">Solo Imágenes</option>
              <option value="video">Solo Videos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Max Items</label>
            <input
              type="number"
              min="1"
              max="20"
              value={zone.maxContentItems}
              onChange={(e) => onUpdate('maxContentItems', parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Rotación (ms)</label>
            <input
              type="number"
              min="1000"
              max="60000"
              step="1000"
              value={zone.rotationInterval}
              onChange={(e) => onUpdate('rotationInterval', parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center text-gray-300">
            <input
              type="checkbox"
              checked={zone.autoRotate}
              onChange={(e) => onUpdate('autoRotate', e.target.checked)}
              className="mr-2"
            />
            Rotación Automática
          </label>
        </div>
      </div>
    );
  };

  const LayoutPreview = ({ layout }: { layout: LayoutConfig }) => {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-medium mb-4">Vista Previa: {layout.name}</h3>
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {layout.zones.map((zone: LayoutZone) => (
            <div
              key={zone.id}
              className="absolute border-2 border-white/30 rounded flex items-center justify-center text-white text-xs font-medium"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                backgroundColor: `${zone.color}20`,
                borderColor: zone.color
              }}
            >
              <div className="text-center">
                <div className="text-xs opacity-75">{zone.label}</div>
                <div className="text-xs opacity-50">{zone.w}% × {zone.h}%</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-400">
          <p><strong>Categoría:</strong> {layout.category}</p>
          <p><strong>Aspecto:</strong> {layout.aspectRatio}</p>
          <p><strong>Zonas:</strong> {layout.zones.length}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {layout.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestor de Layouts</h1>
            <p className="text-gray-400">Crea y personaliza los diseños de tus pantallas digitales</p>
          </div>
          <button
            onClick={handleCreateLayout}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Layout</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">Categoría:</span>
          </div>
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {!isEditing ? (
          /* Grid de Layouts */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layouts.map(layout => (
              <div key={layout.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{layout.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditLayout(layout)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateLayout(layout)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{layout.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{layout.zones.length} zonas</span>
                    <span>{layout.aspectRatio}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">{layout.category}</span>
                  </div>

                  <div className="mb-4">
                    <div className="relative bg-black rounded border border-gray-600" style={{ aspectRatio: '16/9' }}>
                      {layout.zones.slice(0, 4).map((zone: LayoutZone, index: number) => (
                        <div
                          key={zone.id}
                          className="absolute border border-white/20 rounded"
                          style={{
                            left: `${zone.x}%`,
                            top: `${zone.y}%`,
                            width: `${zone.w}%`,
                            height: `${zone.h}%`,
                            backgroundColor: `${zone.color}30`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {layout.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedLayout(layout);
                        setShowPreview(true);
                      }}
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Vista Previa</span>
                    </button>
                    <button
                      onClick={() => {
                        // Aquí iría la lógica para aplicar el layout a un dispositivo
                        console.log('Aplicar layout:', layout.id);
                      }}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Aplicar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Editor de Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Editar Layout</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedLayout && (
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-white font-medium mb-4">Configuración General</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Nombre</label>
                        <input
                          type="text"
                          value={selectedLayout.name}
                          onChange={(e) => setSelectedLayout({ ...selectedLayout, name: e.target.value })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                        <textarea
                          value={selectedLayout.description}
                          onChange={(e) => setSelectedLayout({ ...selectedLayout, description: e.target.value })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                        <select
                          value={selectedLayout.category}
                          onChange={(e) => setSelectedLayout({ ...selectedLayout, category: e.target.value as LayoutConfig['category'] })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="standard">Estándar</option>
                          <option value="retail">Retail</option>
                          <option value="restaurant">Restaurante</option>
                          <option value="corporate">Corporativo</option>
                          <option value="custom">Personalizado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Aspect Ratio</label>
                        <select
                          value={selectedLayout.aspectRatio}
                          onChange={(e) => setSelectedLayout({ ...selectedLayout, aspectRatio: e.target.value as any })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="16:9">16:9 (Widescreen)</option>
                          <option value="9:16">9:16 (Vertical)</option>
                          <option value="4:3">4:3 (Standard)</option>
                          <option value="1:1">1:1 (Square)</option>
                          <option value="custom">Personalizado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-medium">Zonas</h3>
                      <button
                        onClick={addNewZone}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Zona</span>
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedLayout.zones.map((zone: LayoutZone) => (
                        <ZoneEditor
                          key={zone.id}
                          zone={zone}
                          onUpdate={(prop, value) => updateZoneProperty(zone.id, prop, value)}
                          onRemove={() => removeZone(zone.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveLayout}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      <span>Guardar</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              {selectedLayout && <LayoutPreview layout={selectedLayout} />}
            </div>
          </div>
        )}

        {/* Modal de Vista Previa */}
        {showPreview && selectedLayout && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Vista Previa: {selectedLayout.name}</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <LayoutPreview layout={selectedLayout} />
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleEditLayout(selectedLayout);
                      setShowPreview(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Editar
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