'use client';

import Topbar from '@/components/Topbar';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { allDevices } from '../devices/page';
import {
  Upload, Image, Video, Globe, Database, Search,
  Filter, MoreVertical, X, CheckCircle2, Loader2,
  CloudUpload, FileVideo, FileImage, Link
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────
interface ContentItem {
  id: string;
  name: string;
  folder?: string;
  type: 'video' | 'image' | 'webpage' | 'data_widget';
  r2_url: string | null;
  size_bytes: number;
  duration_sec: number;
  created_at: string;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
  contentId?: string;
}

// ─── Helpers ─────────────────────────────────────────
function formatBytes(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const typeIcon = { video: FileVideo, image: FileImage, webpage: Globe, data_widget: Globe };
const typeColors: Record<string, string> = { video: '#8b5cf6', image: '#3b82f6', webpage: '#06b6d4', data_widget: '#06b6d4' };
const typeBadgeStyle: Record<string, React.CSSProperties> = {
  video:       { background: 'rgba(139,92,246,0.1)',  color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' },
  image:       { background: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' },
  webpage:     { background: 'rgba(6,182,212,0.1)',   color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' },
  data_widget: { background: 'rgba(6,182,212,0.1)',   color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' },
};

// ─── Upload Modal ─────────────────────────────────────
function UploadModal({ onClose, onDone, devices }: { onClose: () => void; onDone: () => void; devices: any[] }) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const [webName, setWebName] = useState('');
  const [tab, setTab] = useState<'file' | 'web'>('file');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles).map(f => ({
      file: f, progress: 0, status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...arr]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  async function uploadAll() {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));

      try {
        // 1. Get presigned URL from our API
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: files[i].file.name,
            contentType: files[i].file.type,
            size: files[i].file.size,
            deviceId: selectedDevice || undefined
          }),
        });

        if (!res.ok) throw new Error('Failed to get upload URL');
        const { presignedUrl, key, publicUrl, type, size, userId, clientId } = await res.json();

        // 2. Upload directly to R2 using presigned URL
        const xhr = new XMLHttpRequest();
        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: pct } : f));
            }
          };
          xhr.onload = () => xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`));
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', files[i].file.type);
          xhr.send(files[i].file);
        });

        // 3. Register content in admin library after successful upload
        try {
          const registerRes = await fetch('/api/content/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: files[i].file.name,
              description: `Archivo subido: ${files[i].file.name}`,
              url: publicUrl,
              type: type,
              duration: type === 'video' ? 10000 : 5000, // 10s for video, 5s for image
              size: files[i].file.size,
              tags: [type, 'uploaded'],
              adminId: 'ADMIN-001'
            }),
          });

          if (!registerRes.ok) {
            console.error('Failed to register content in admin library');
          }
        } catch (registerError) {
          console.error('Error registering content:', registerError);
        }

        // 4. Mark as done
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'done', progress: 100, contentId: key } : f
        ));
      } catch (err: any) {
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'error', error: err.message } : f
        ));
      }
    }
    onDone();
  }

  async function addWebpage() {
    if (!webUrl) return;
    const supabase = createClient();
    await supabase.from('content').insert({
      name: webName || webUrl,
      type: 'webpage',
      r2_url: webUrl,
      duration_sec: 30,
    });
    onDone();
    onClose();
  }

  const allDone = files.length > 0 && files.every(f => f.status === 'done' || f.status === 'error');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card" style={{ width: '560px', maxHeight: '80vh', overflow: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Subir Contenido</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>Se guarda directo en Cloudflare R2</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '20px', width: 'fit-content' }}>
          {[{ key: 'file', label: 'Archivo' }, { key: 'web', label: 'URL / Webpage' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none',
              fontWeight: 600, fontSize: '12.5px', cursor: 'pointer',
              background: tab === t.key ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: tab === t.key ? '#60a5fa' : 'var(--text-secondary)',
              boxShadow: tab === t.key ? '0 0 0 1px rgba(59,130,246,0.3)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Device Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Carpeta de Destino (Dispositivo)
          </label>
          <select 
            className="input-field" 
            value={selectedDevice} 
            onChange={(e) => setSelectedDevice(e.target.value)}
            style={{ width: '100%', appearance: 'auto' }}
          >
            <option value="">Carpeta General (uploads/)</option>
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name} {d.location ? `(${d.location})` : ''}</option>
            ))}
          </select>
        </div>

        {tab === 'file' && (
          <>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '14px', padding: '36px 20px',
                textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s', marginBottom: '16px',
              }}
            >
              <CloudUpload size={36} color={dragging ? '#3b82f6' : 'var(--text-muted)'} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', fontWeight: 600, color: dragging ? '#60a5fa' : 'var(--text-primary)' }}>
                Arrastra archivos aquí
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                o click para seleccionar · Videos, imágenes — sin límite de tamaño
              </p>
              <input ref={inputRef} type="file" multiple accept="video/*,image/*" style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files)} />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', maxHeight: '220px', overflowY: 'auto' }}>
                {files.map((f, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: f.status === 'uploading' ? '8px' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        {f.file.type.startsWith('video/') ? <FileVideo size={16} color="#8b5cf6" /> : <FileImage size={16} color="#3b82f6" />}
                        <span style={{ fontSize: '12.5px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.file.name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                          {formatBytes(f.file.size)}
                        </span>
                      </div>
                      <div style={{ flexShrink: 0, marginLeft: '10px' }}>
                        {f.status === 'done'      && <CheckCircle2 size={16} color="#34d399" />}
                        {f.status === 'error'     && <X size={16} color="#f87171" />}
                        {f.status === 'uploading' && <Loader2 size={16} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />}
                        {f.status === 'pending'   && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pendiente</span>}
                      </div>
                    </div>
                    {f.status === 'uploading' && (
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${f.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
                      </div>
                    )}
                    {f.status === 'error' && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{f.error}</p>}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={uploadAll}
                disabled={files.length === 0 || files.every(f => f.status !== 'pending')}
                style={{ opacity: files.length === 0 ? 0.5 : 1 }}
              >
                {allDone
                  ? <><CheckCircle2 size={15} /> Listo</>
                  : <><Upload size={15} /> Subir {files.length > 0 ? `(${files.length})` : ''}</>}
              </button>
            </div>
          </>
        )}

        {tab === 'web' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                URL de la página web
              </label>
              <div style={{ position: 'relative' }}>
                <Link size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="url" placeholder="https://example.com/display" className="input-field"
                  style={{ paddingLeft: '34px' }} value={webUrl} onChange={e => setWebUrl(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Nombre (opcional)
              </label>
              <input type="text" placeholder="Ej: Widget de Clima" className="input-field"
                value={webName} onChange={e => setWebName(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn-primary" onClick={addWebpage} disabled={!webUrl}>
                <Globe size={15} /> Agregar URL
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────
export default function ContentPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [devices, setDevices] = useState<typeof allDevices>([]);

  const supabase = createClient();

  useEffect(() => {
    async function loadDevices() {
      const { data, error } = await supabase.from('devices').select('id, name, location').order('name');
      if (error || !data || data.length === 0) {
        setDevices(allDevices); // fallback a datos estáticos si falla o está vacío
      } else {
        setDevices(data as any);
      }
    }
    loadDevices();
  }, []);

  async function loadContent() {
    setLoading(true);
    try {
      const url = folderFilter === 'all' 
        ? '/api/content' 
        : `/api/content?deviceId=${folderFilter === 'general' ? '' : folderFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Error cargando contenido');
      
      setItems(json.data ?? []);
    } catch (error: any) {
      console.error('Error cargando contenido de R2:', error);
      alert(`Error al cargar desde R2: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Load on mount and when folderFilter changes
  useEffect(() => { loadContent(); }, [folderFilter]);

  const filtered = items.filter(i => {
    const matchType = filterType === 'all' || i.type === filterType;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const counts = {
    total: items.length,
    video: items.filter(i => i.type === 'video').length,
    image: items.filter(i => i.type === 'image').length,
    totalBytes: items.reduce((a, i) => a + (i.size_bytes ?? 0), 0),
  };

  return (
    <div>
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onDone={() => { loadContent(); setShowUpload(false); }}
          devices={devices}
        />
      )}

      <Topbar title="Biblioteca de Contenido" subtitle="Gestiona todos los medios en Cloudflare R2" />

      <div style={{ padding: '28px 32px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total Archivos', value: counts.total,             icon: Database, color: '#3b82f6' },
            { label: 'Videos',         value: counts.video,             icon: Video,    color: '#8b5cf6' },
            { label: 'Imágenes',       value: counts.image,             icon: Image,    color: '#06b6d4' },
            { label: 'Storage R2',     value: formatBytes(counts.totalBytes), icon: Database, color: '#10b981' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search + Filter + Upload */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input placeholder="Buscar contenido..." className="input-field"
                style={{ paddingLeft: '34px', width: '240px' }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <select 
              className="input-field"
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              style={{ appearance: 'auto', padding: '6px 12px', height: '34px', fontSize: '12px', minWidth: '150px' }}
            >
              <option value="all">Todas las carpetas</option>
              <option value="general">Carpeta General</option>
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              {[
                { key: 'all', label: 'Todos' }, { key: 'video', label: 'Videos' },
                { key: 'image', label: 'Imágenes' }, { key: 'webpage', label: 'Web' },
              ].map(f => (
                <button key={f.key} onClick={() => setFilterType(f.key)} style={{
                  padding: '6px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '12px',
                  background: filterType === f.key ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: filterType === f.key ? '#60a5fa' : 'var(--text-secondary)',
                  boxShadow: filterType === f.key ? '0 0 0 1px rgba(59,130,246,0.3)' : 'none',
                }}>{f.label}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowUpload(true)}>
            <Upload size={15} /> Subir a R2
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p>Cargando contenido...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <CloudUpload size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '15px', fontWeight: 600 }}>
              {items.length === 0 ? 'No hay contenido aún' : 'Sin resultados'}
            </p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              {items.length === 0 ? 'Sube tu primer video o imagen para comenzar' : 'Intenta con otro filtro'}
            </p>
            {items.length === 0 && (
              <button className="btn-primary" style={{ margin: '20px auto 0' }} onClick={() => setShowUpload(true)}>
                <Upload size={15} /> Subir Contenido
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {filtered.map((item) => {
              const Icon = typeIcon[item.type] ?? Globe;
              const color = typeColors[item.type];
              return (
                <div key={item.id} className="glass-card glass-card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: '110px', background: `linear-gradient(135deg, ${color}18, ${color}06)`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                    {item.type === 'image' && item.r2_url ? (
                      <img src={item.r2_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : item.type === 'video' && item.r2_url ? (
                      <video src={item.r2_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline preload="metadata" />
                    ) : (
                      <Icon size={36} color={color} style={{ opacity: 0.6 }} />
                    )}
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', flex: 1, marginRight: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </p>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                        <MoreVertical size={15} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="badge" style={typeBadgeStyle[item.type]}>{item.type}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatBytes(item.size_bytes)}</span>
                      {item.folder && item.folder !== 'uploads' && (
                        <span style={{ fontSize: '11px', color: '#60a5fa', border: '1px solid #3b82f640', padding: '2px 6px', borderRadius: '4px' }}>
                          {item.folder.replace('dispositivos/', '')}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {new Date(item.created_at).toLocaleDateString('es-PR', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
