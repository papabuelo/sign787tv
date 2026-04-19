'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Maximize2, Settings, Monitor, ListVideo, Eye, Download, Share2, Power, Volume2, Settings as SettingsIcon, Home, ArrowLeft } from 'lucide-react';
import { allDevices } from '@/types';
import { getAllLayouts, type LayoutConfig } from '@/lib/layouts';
import { getDeviceAssignedLayout, getDeviceActiveContent, type ContentItem } from '@/lib/admin-control';
import { useSearchParams } from 'next/navigation';

// Samsung TV Frame Component - 50" TV with realistic proportions
function SamsungTVFrame({ children, isOn, onPowerToggle }: { children: React.ReactNode; isOn: boolean; onPowerToggle: () => void }) {
  // TV 50" dimensions (16:9 aspect ratio) - 1106 x 622 mm
  // For display purposes, we'll use a scaled version
  const tvWidth = 896; // pixels (scaled for web display)
  const tvHeight = 504; // pixels (16:9 ratio)
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Samsung Logo */}
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <span className="text-white text-2xl font-light tracking-wider">SAMSUNG</span>
      </div>

      {/* TV Frame - Samsung 50" Design */}
      <div className="relative" style={{ width: tvWidth, height: tvHeight }}>
        {/* Outer Frame - Ultra-thin bezel Samsung design */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl p-1">
          {/* Premium Samsung Bezel */}
          <div className="bg-black rounded-lg p-0.5">
            {/* Screen Area - 50" display */}
            <div 
              className={`relative bg-black rounded overflow-hidden transition-all duration-700 ${
                isOn ? 'opacity-100' : 'opacity-20'
              }`}
              style={{ width: tvWidth - 16, height: tvHeight - 16 }}
            >
              {/* Screen Reflection Effect - Premium Samsung */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
              
              {/* Content */}
              <div className="relative z-0 w-full h-full">
                {children}
              </div>

              {/* Power LED Indicator - Samsung style */}
              <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full transition-all duration-300 ${
                isOn ? 'bg-red-500 shadow-red-500/60 shadow-lg animate-pulse' : 'bg-gray-600'
              }`} />
            </div>
          </div>

          {/* Samsung Ultra-thin branding */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-3 text-gray-400 text-xs">
              <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-xs font-light">SAMSUNG 50" Smart TV</span>
            </div>
          </div>
        </div>

        {/* Samsung TV Stand - Modern design */}
        <div className="mt-10 flex justify-center">
          {/* Stand neck */}
          <div className="relative">
            <div className="w-6 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg shadow-lg" />
            {/* Cable management */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gray-900 rounded-full" />
          </div>
        </div>
        
        {/* Samsung TV Base - Premium design */}
        <div className="flex justify-center -mt-1">
          <div className="w-64 h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl">
            {/* Base accents */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-t-lg" />
          </div>
        </div>
      </div>

      {/* Samsung Smart Remote Control */}
      <div className="mt-12 bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
        <div className="text-center mb-4">
          <span className="text-gray-300 text-sm font-medium">Smart Remote</span>
        </div>
        <div className="flex items-center justify-center space-x-6">
          {/* Power Button - Samsung style */}
          <button
            onClick={onPowerToggle}
            className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
              isOn ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <Power className="w-6 h-6" />
          </button>
          
          {/* Control cluster */}
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 shadow-md">
                <Volume2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 shadow-md">
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex space-x-3">
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 shadow-md">
                <Home className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 shadow-md">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Player Component con contenido administrativo
function ContentPlayer({ content, currentTime, isPlaying, playbackSpeed, layout }: {
  content: ContentItem[];
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  layout: LayoutConfig;
}) {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [zoneTimers, setZoneTimers] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (!isPlaying || content.length === 0) return;

    const totalDuration = content.reduce((sum, item) => sum + item.duration, 0);
    const effectiveTime = currentTime * playbackSpeed;
    const loopedTime = effectiveTime % totalDuration;

    let accumulatedTime = 0;
    let newIndex = 0;
    
    for (let i = 0; i < content.length; i++) {
      if (loopedTime >= accumulatedTime && loopedTime < accumulatedTime + content[i].duration) {
        newIndex = i;
        break;
      }
      accumulatedTime += content[i].duration;
    }

    setCurrentContentIndex(newIndex);

    // Update zone timers for multi-zone layouts
    if (layout.zones.length > 1) {
      const newZoneTimers: {[key: string]: number} = {};
      layout.zones.forEach((zone: any, index: number) => {
        newZoneTimers[zone.id] = (loopedTime + index * 2000) % totalDuration;
      });
      setZoneTimers(newZoneTimers);
    }
  }, [currentTime, isPlaying, playbackSpeed, content, layout.zones]);

  const getCurrentContentForZone = (zoneId: string) => {
    if (layout.zones.length === 1) {
      return content[currentContentIndex];
    } else {
      const timer = zoneTimers[zoneId] || 0;
      let accumulatedTime = 0;
      for (let i = 0; i < content.length; i++) {
        if (timer >= accumulatedTime && timer < accumulatedTime + content[i].duration) {
          return content[i];
        }
        accumulatedTime += content[i].duration;
      }
      return content[0];
    }
  };

  return (
    <div className="relative w-full h-full">
      {layout.zones.map((zone: any) => {
        const zoneContent = getCurrentContentForZone(zone.id);
        const progress = layout.zones.length === 1 ? 
          ((currentTime * playbackSpeed) % content.reduce((sum, item) => sum + item.duration, 0)) / content[currentContentIndex].duration * 100 :
          ((zoneTimers[zone.id] || 0) % content[0].duration) / content[0].duration * 100;

        return (
          <div
            key={zone.id}
            className="absolute border-2 border-gray-600 overflow-hidden"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
              backgroundColor: zone.color + '20'
            }}
          >
            {zoneContent && (
              <>
                {zoneContent.type === 'image' ? (
                  <img
                    src={zoneContent.url}
                    alt={zoneContent.title}
                    className="w-full h-full object-cover"
                  />
                ) : zoneContent.type === 'video' ? (
                  <video
                    src={zoneContent.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-800">
                    <div className="text-center text-white">
                      <div className="text-lg font-medium">{zoneContent.title}</div>
                      <div className="text-sm opacity-75">{zoneContent.description}</div>
                    </div>
                  </div>
                )}
                
                {/* Content Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h4 className="text-white text-sm font-semibold">{zoneContent.title}</h4>
                  <p className="text-gray-300 text-xs">{zoneContent.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div 
                    className="h-full bg-white transition-all duration-100"
                    style={{ width: `${progress % 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Main Component con control administrativo
export default function PreviewPage() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  const [availableLayouts, setAvailableLayouts] = useState<LayoutConfig[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutConfig | null>(null);
  const [deviceContent, setDeviceContent] = useState<ContentItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isTVOn, setIsTVOn] = useState(true);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);

  const currentDevice = allDevices.find(device => device.id === deviceId);

  useEffect(() => {
    // Cargar layouts disponibles
    const layouts = getAllLayouts();
    setAvailableLayouts(layouts);
    
    // Cargar layout asignado al dispositivo (control administrativo)
    if (deviceId) {
      const assignedLayout = getDeviceAssignedLayout(currentDevice?.clientId || '', deviceId);
      if (assignedLayout) {
        const layout = layouts.find((l: LayoutConfig) => l.id === assignedLayout.layoutId);
        if (layout) {
          setSelectedLayout(layout);
        }
      }
    }
    
    // Cargar contenido asignado al dispositivo (control administrativo)
    if (deviceId && currentDevice) {
      const content = getDeviceActiveContent(currentDevice.clientId, deviceId);
      setDeviceContent(content);
    }
  }, [deviceId, currentDevice]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const resetPlayback = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const toggleTVPower = () => {
    setIsTVOn(!isTVOn);
    if (!isTVOn) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleLayoutChange = (layout: LayoutConfig) => {
    setSelectedLayout(layout);
    setShowLayoutSelector(false);
  };

  return (
    <div className={`min-h-screen ${isFullscreen ? 'bg-black' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'}`}>
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Monitor className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-white text-lg font-semibold">Samsung TV Preview</h1>
              <p className="text-gray-400 text-sm">
                {currentDevice ? `${currentDevice.name} - ${selectedLayout?.name || 'Sin layout asignado'}` : 'Demo Mode'}
              </p>
              {currentDevice && (
                <p className="text-gray-500 text-xs">
                  Contenido administrativo • {deviceContent.length} elementos asignados
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Layout Selector with admin control */}
            <div className="relative">
              <button
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 hover:border-blue-500 focus:outline-none focus:border-blue-500 flex items-center space-x-2"
              >
                <span>{selectedLayout?.name || 'Layout Administrativo'}</span>
                <Settings className="w-4 h-4" />
              </button>
              
              {showLayoutSelector && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-3">Layout Asignado</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedLayout ? (
                        <div className="bg-blue-600 text-white p-3 rounded-lg">
                          <div className="font-medium">{selectedLayout.name}</div>
                          <div className="text-sm opacity-75">{selectedLayout.description}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs">{selectedLayout.zones.length} zonas</span>
                            <span className="text-xs px-2 py-1 bg-blue-500 rounded">Asignado</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-700 text-gray-300 p-3 rounded-lg text-center">
                          <div className="text-sm">Sin layout asignado</div>
                          <div className="text-xs opacity-75">Contacta al administrador</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-gray-400 text-xs">
                        Los layouts son asignados por el administrador. Los clientes no pueden cambiarlos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={resetPlayback}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Reiniciar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Pantalla completa"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              title="Mostrar cuadrícula"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="px-4 pb-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">Velocidad:</span>
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  playbackSpeed === speed 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main TV Display */}
      <div className="pt-32">
        <SamsungTVFrame isOn={isTVOn} onPowerToggle={toggleTVPower}>
          <div className="relative w-full h-full bg-black">
            {isTVOn && selectedLayout && deviceContent.length > 0 ? (
              <>
                <ContentPlayer
                  content={deviceContent}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  layout={selectedLayout}
                />

                {/* Grid Overlay */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="w-full h-full opacity-20">
                      {/* Vertical lines */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={`v-${i}`}
                          className="absolute top-0 bottom-0 w-px bg-white"
                          style={{ left: `${(i + 1) * 10}%` }}
                        />
                      ))}
                      {/* Horizontal lines */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={`h-${i}`}
                          className="absolute left-0 right-0 h-px bg-white"
                          style={{ top: `${(i + 1) * 10}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-black">
                <div className="text-center text-gray-500">
                  {isTVOn && !selectedLayout ? (
                    <>
                      <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Sin layout asignado</p>
                      <p className="text-sm">Contacta al administrador</p>
                    </>
                  ) : isTVOn && deviceContent.length === 0 ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 opacity-50 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">📷</span>
                        </div>
                      </div>
                      <p className="text-lg">Sin contenido asignado</p>
                      <p className="text-sm">El administrador aún no ha asignado contenido</p>
                    </>
                  ) : (
                    <>
                      <Power className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">TV Apagado</p>
                      <p className="text-sm">Presiona el botón de encendido</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </SamsungTVFrame>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-4">
            <span>Layout: <span className="text-blue-400">{selectedLayout?.name || 'Sin asignar'}</span></span>
            <span>Estado: <span className={isPlaying ? 'text-green-400' : 'text-red-400'}>
              {isPlaying ? 'Reproduciendo' : 'Pausado'}
            </span></span>
            <span>Velocidad: <span className="text-yellow-400">{playbackSpeed}x</span></span>
            {currentDevice && (
              <span className="text-gray-400">
                Contenido: <span className="text-blue-400">{deviceContent.length} elementos</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              Tiempo: {Math.floor(currentTime / 1000)}s
            </span>
            {deviceContent.length > 0 && (
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                  style={{ 
                    width: `${((currentTime * playbackSpeed) % deviceContent.reduce((sum, item) => sum + item.duration, 0)) / deviceContent.reduce((sum, item) => sum + item.duration, 0) * 100}%` 
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}