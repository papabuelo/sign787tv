'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Maximize2, Settings, Monitor, ListVideo, Eye, Download, Share2 } from 'lucide-react';
import { allClients } from '@/types';
import type { Device, Playlist } from '@/types';
import { useSearchParams } from 'next/navigation';

// Contenido de prueba con imágenes y videos reales
const sampleContent = [
  {
    id: 'CONTENT-001',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-1.jpg',
    duration: 5000,
    name: 'Promoción Especial',
    description: 'Oferta de hamburguesas 2x1'
  },
  {
    id: 'CONTENT-002', 
    type: 'video',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-video.mp4',
    duration: 10000,
    name: 'Video Promocional',
    description: 'Comercial de 10 segundos'
  },
  {
    id: 'CONTENT-003',
    type: 'image', 
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-2.jpg',
    duration: 5000,
    name: 'Oferta del Día',
    description: 'Descuento especial 20%'
  },
  {
    id: 'CONTENT-004',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-3.jpg',
    duration: 5000,
    name: 'Nuevo Producto',
    description: 'Lanzamiento especial'
  }
];

// Layouts disponibles con descripciones
const layouts = {
  'Full Screen': {
    zones: [
      { id: 'main', x: 0, y: 0, w: 100, h: 100, color: '#3b82f6', label: 'Contenido Principal' }
    ],
    description: 'Una sola zona que ocupa toda la pantalla'
  },
  '2-Split': {
    zones: [
      { id: 'left', x: 0, y: 0, w: 50, h: 100, color: '#3b82f6', label: 'Zona Izquierda' },
      { id: 'right', x: 50, y: 0, w: 50, h: 100, color: '#10b981', label: 'Zona Derecha' }
    ],
    description: 'Dos zonas divididas verticalmente'
  },
  '4 Zonas': {
    zones: [
      { id: 'tl', x: 0, y: 0, w: 50, h: 50, color: '#3b82f6', label: 'Arriba Izq' },
      { id: 'tr', x: 50, y: 0, w: 50, h: 50, color: '#10b981', label: 'Arriba Der' },
      { id: 'bl', x: 0, y: 50, w: 50, h: 50, color: '#f59e0b', label: 'Abajo Izq' },
      { id: 'br', x: 50, y: 50, w: 50, h: 50, color: '#ef4444', label: 'Abajo Der' }
    ],
    description: 'Cuatro zonas en cuadrícula'
  },
  'L-Shape': {
    zones: [
      { id: 'main', x: 0, y: 0, w: 70, h: 100, color: '#3b82f6', label: 'Principal' },
      { id: 'top-right', x: 70, y: 0, w: 30, h: 50, color: '#10b981', label: 'Arriba Der' },
      { id: 'bottom-right', x: 70, y: 50, w: 30, h: 50, color: '#f59e0b', label: 'Abajo Der' }
    ],
    description: 'Layout en forma de L'
  },
  'Main + Ticker': {
    zones: [
      { id: 'main', x: 0, y: 0, w: 100, h: 85, color: '#3b82f6', label: 'Contenido Principal' },
      { id: 'ticker', x: 0, y: 85, w: 100, h: 15, color: '#10b981', label: 'Ticker Inferior' }
    ],
    description: 'Contenido principal con ticker'
  }
};

export default function DevicePreviewPage() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get('device');
  
  const [selectedLayout, setSelectedLayout] = useState('Full Screen');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentZone, setCurrentZone] = useState('main');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    // Cargar dispositivos de prueba
    const sampleDevices: Device[] = [
      {
        id: 'TEST-001',
        name: 'Dispositivo-Prueba-SIGN787',
        clientId: 'CLIENT-001',
        client: 'Demo Client',
        location: 'Laboratorio, PR',
        status: 'online',
        layout: 'Full Screen',
        playlistId: 'PLAYLIST-001',
        uptime: '100%',
        lastSeen: 'Ahora',
        ip: '192.168.1.100',
        storage: 15,
        version: '2.4.1'
      }
    ];
    setDevices(sampleDevices);
    
    // Seleccionar dispositivo si se pasa por URL
    if (deviceId) {
      const device = sampleDevices.find(d => d.id === deviceId);
      if (device) {
        setSelectedDevice(device);
        setSelectedLayout(device.layout);
      }
    }
  }, [deviceId]);

  // Control de reproducción con velocidad ajustable
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      const adjustedDuration = currentContent.duration / playbackSpeed;
      interval = setInterval(() => {
        setCurrentContentIndex((prev) => (prev + 1) % sampleContent.length);
      }, adjustedDuration);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentContentIndex, playbackSpeed]);

  const currentContent = sampleContent[currentContentIndex];
  const currentLayoutData = layouts[selectedLayout as keyof typeof layouts];

  // Función para pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Función para descargar captura
  const downloadScreenshot = () => {
    // Implementar captura de pantalla
    alert('Función de captura de pantalla - Se implementará con html2canvas');
  };

  // Función para compartir
  const sharePreview = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SIGN787 TV Preview',
        text: `Visualización de dispositivo: ${selectedDevice?.name || 'Demo'}`,
        url: window.location.href
      });
    } else {
      // Copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 32px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px 0' }}>
              🖥️ Visualización de Dispositivo
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
              {selectedDevice 
                ? `Simulación en tiempo real: ${selectedDevice.name}` 
                : 'Simulación de pantalla de TV digital'
              }
            </p>
          </div>
          
          {/* Controles principales */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Selector de dispositivo */}
            <select 
              value={selectedDevice?.id || 'TEST-001'}
              onChange={(e) => {
                const device = devices.find(d => d.id === e.target.value);
                if (device) {
                  setSelectedDevice(device);
                  setSelectedLayout(device.layout);
                }
              }}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '13px'
              }}
            >
              {devices.map(device => (
                <option key={device.id} value={device.id}>{device.name}</option>
              ))}
            </select>
            
            {/* Selector de layout */}
            <select 
              value={selectedLayout}
              onChange={(e) => setSelectedLayout(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '13px'
              }}
            >
              {Object.keys(layouts).map(layout => (
                <option key={layout} value={layout}>{layout}</option>
              ))}
            </select>
            
            {/* Botones de acción */}
            <button
              onClick={toggleFullscreen}
              style={{
                padding: '8px', borderRadius: '6px', border: 'none',
                background: 'rgba(255,255,255,0.1)', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
              title="Pantalla completa"
            >
              <Maximize2 size={16} />
            </button>
            
            <button
              onClick={downloadScreenshot}
              style={{
                padding: '8px', borderRadius: '6px', border: 'none',
                background: 'rgba(255,255,255,0.1)', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
              title="Descargar captura"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={sharePreview}
              style={{
                padding: '8px', borderRadius: '6px', border: 'none',
                background: 'rgba(255,255,255,0.1)', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
              title="Compartir"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
        {/* Panel de control */}
        <div style={{ 
          width: '320px', 
          padding: '24px', 
          borderRight: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.02)',
          overflowY: 'auto'
        }}>
          {/* Información del layout */}
          <div style={{
            padding: '16px', borderRadius: '8px',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0' }}>
              📐 Layout Actual: {selectedLayout}
            </h3>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              {currentLayoutData.description}
            </p>
            <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '8px' }}>
              {currentLayoutData.zones.length} zonas activas
            </div>
          </div>

          {/* Control de reproducción */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>
              <ListVideo size={16} style={{ marginRight: '8px' }} />
              Control de Reproducción
            </h3>
            
            {/* Botones principales */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                  background: isPlaying ? '#ef4444' : '#10b981', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 500
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pausar' : 'Reproducir'}
              </button>
              
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentContentIndex(0);
                }}
                style={{
                  padding: '12px', borderRadius: '8px', border: 'none',
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Detener y reiniciar"
              >
                <Square size={18} />
              </button>
            </div>

            {/* Velocidad de reproducción */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>
                Velocidad: {playbackSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Opciones de visualización */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  style={{ accentColor: '#3b82f6' }}
                />
                <span style={{ fontSize: '12px' }}>Mostrar cuadrícula</span>
              </label>
            </div>
          </div>

          {/* Información del contenido actual */}
          <div style={{
            padding: '16px', borderRadius: '8px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px 0' }}>
              🎬 Contenido Actual
            </h4>
            <p style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 500 }}>
              {currentContent.name}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>
              {currentContent.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#60a5fa' }}>
              <span>Tipo: {currentContent.type === 'image' ? '🖼️ Imagen' : '🎥 Video'}</span>
              <span>⏱️ {currentContent.duration / 1000}s</span>
            </div>
          </div>

          {/* Lista de contenido */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px 0' }}>
              📋 Playlist Completa
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sampleContent.map((content, index) => (
                <div
                  key={content.id}
                  onClick={() => {
                    setCurrentContentIndex(index);
                    setIsPlaying(false);
                  }}
                  style={{
                    padding: '12px', borderRadius: '6px', cursor: 'pointer',
                    background: index === currentContentIndex 
                      ? 'rgba(59,130,246,0.2)' 
                      : 'rgba(255,255,255,0.05)',
                    border: index === currentContentIndex 
                      ? '1px solid rgba(59,130,246,0.3)' 
                      : '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>
                      {index + 1}. {content.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {content.type === 'image' ? '🖼️' : '🎥'}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                    {content.description}
                  </div>
                  <div style={{ fontSize: '10px', color: '#60a5fa', marginTop: '4px' }}>
                    ⏱️ {content.duration / 1000} segundos
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Área de visualización - Simulación de TV */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '450px', // Proporción 9:16 para TV vertical
            height: '800px',
            background: '#000',
            borderRadius: '24px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'hidden',
            border: '8px solid #1a1a1a'
          }}>
            {/* Marco interior de la pantalla */}
            <div style={{
              position: 'absolute', inset: '12px', borderRadius: '16px',
              border: '2px solid rgba(255,255,255,0.1)', pointerEvents: 'none'
            }} />
            
            {/* Contenido según layout */}
            <div style={{ position: 'absolute', inset: '24px' }}>
              {currentLayoutData.zones.map((zone) => (
                <div
                  key={zone.id}
                  style={{
                    position: 'absolute',
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.w}%`,
                    height: `${zone.h}%`,
                    background: zone.color + '20',
                    border: showGrid ? `1px solid ${zone.color}` : 'none',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Contenido real */}
                  {currentContent.type === 'image' ? (
                    <img
                      src={currentContent.url}
                      alt={currentContent.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                  ) : (
                    <video
                      src={currentContent.url}
                      autoPlay={isPlaying}
                      muted
                      loop
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                  )}
                  
                  {/* Etiqueta de la zona */}
                  {showGrid && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500
                    }}>
                      {zone.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Indicador de estado profesional */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isPlaying ? '#10b981' : '#ef4444',
                animation: isPlaying ? 'pulse 1.5s infinite' : 'none'
              }} />
              <span style={{ fontWeight: 500 }}>
                {isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}
              </span>
            </div>

            {/* Barra de progreso */}
            {isPlaying && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: '#3b82f6',
                  borderRadius: '2px',
                  animation: `progress ${currentContent.duration}ms linear infinite`,
                  animationPlayState: isPlaying ? 'running' : 'paused'
                }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}