'use client';

import Topbar from '@/components/Topbar';
import { Plus, Clock, Layers, Play, MoreVertical, ArrowRight, ChevronRight, Timer } from 'lucide-react';
import { useState, Fragment } from 'react';

interface Zone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
}

interface LayoutTemplate {
  id: string;
  name: string;
  zones: Zone[];
  zoneCount: number;
}

interface SequenceStep {
  layout: LayoutTemplate;
  durationMin: number;
}

const ZONE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'full', name: 'Full Screen', zoneCount: 1,
    zones: [{ id: 'z1', x: 0, y: 0, w: 100, h: 100, color: ZONE_COLORS[0], label: 'Z1' }]
  },
  {
    id: 'half-h', name: '2 Split Horizontal', zoneCount: 2,
    zones: [
      { id: 'z1', x: 0, y: 0, w: 50, h: 100, color: ZONE_COLORS[0], label: 'Z1' },
      { id: 'z2', x: 50, y: 0, w: 50, h: 100, color: ZONE_COLORS[1], label: 'Z2' },
    ]
  },
  {
    id: 'half-v', name: '2 Split Vertical', zoneCount: 2,
    zones: [
      { id: 'z1', x: 0, y: 0, w: 100, h: 50, color: ZONE_COLORS[0], label: 'Z1' },
      { id: 'z2', x: 0, y: 50, w: 100, h: 50, color: ZONE_COLORS[1], label: 'Z2' },
    ]
  },
  {
    id: 'quad', name: '4 Zonas Iguales', zoneCount: 4,
    zones: [
      { id: 'z1', x: 0, y: 0, w: 50, h: 50, color: ZONE_COLORS[0], label: 'Z1' },
      { id: 'z2', x: 50, y: 0, w: 50, h: 50, color: ZONE_COLORS[1], label: 'Z2' },
      { id: 'z3', x: 0, y: 50, w: 50, h: 50, color: ZONE_COLORS[2], label: 'Z3' },
      { id: 'z4', x: 50, y: 50, w: 50, h: 50, color: ZONE_COLORS[3], label: 'Z4' },
    ]
  },
  {
    id: 'l-shape', name: 'L-Shape 70/30', zoneCount: 3,
    zones: [
      { id: 'z1', x: 0, y: 0, w: 70, h: 100, color: ZONE_COLORS[0], label: 'Main' },
      { id: 'z2', x: 70, y: 0, w: 30, h: 50, color: ZONE_COLORS[1], label: 'Z2' },
      { id: 'z3', x: 70, y: 50, w: 30, h: 50, color: ZONE_COLORS[2], label: 'Z3' },
    ]
  },
  {
    id: 'ticker', name: 'Main + Bottom Ticker', zoneCount: 2,
    zones: [
      { id: 'z1', x: 0, y: 0, w: 100, h: 85, color: ZONE_COLORS[0], label: 'Main' },
      { id: 'z2', x: 0, y: 85, w: 100, h: 15, color: ZONE_COLORS[4], label: 'Ticker' },
    ]
  },
];

function LayoutPreview({ layout, size = 120 }: { layout: LayoutTemplate; size?: number }) {
  const ratio = 9 / 16;
  const w = size;
  const h = Math.round(size * ratio);
  return (
    <div style={{
      width: w, height: h, borderRadius: '6px',
      position: 'relative', overflow: 'hidden',
      background: '#0d1120', border: '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0
    }}>
      {layout.zones.map((zone) => (
        <div key={zone.id} style={{
          position: 'absolute',
          left: `${zone.x}%`, top: `${zone.y}%`,
          width: `${zone.w}%`, height: `${zone.h}%`,
          background: `${zone.color}22`,
          border: `1px solid ${zone.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: `${Math.max(8, size / 14)}px`, fontWeight: 700, color: zone.color, opacity: 0.8 }}>
            {zone.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Example sequences
const exampleSequences = [
  {
    id: 's1', name: 'Secuencia Mañana', deviceCount: 23,
    steps: [
      { layout: layoutTemplates[0], durationMin: 10 },
      { layout: layoutTemplates[3], durationMin: 5 },
      { layout: layoutTemplates[5], durationMin: 20 },
    ],
    schedule: 'Lun–Vie · 08:00–12:00'
  },
  {
    id: 's2', name: 'Secuencia Tarde', deviceCount: 41,
    steps: [
      { layout: layoutTemplates[1], durationMin: 15 },
      { layout: layoutTemplates[0], durationMin: 10 },
      { layout: layoutTemplates[4], durationMin: 30 },
      { layout: layoutTemplates[3], durationMin: 5 },
    ],
    schedule: 'Lun–Vie · 12:00–18:00'
  },
  {
    id: 's3', name: 'Weekend Promo', deviceCount: 67,
    steps: [
      { layout: layoutTemplates[0], durationMin: 20 },
      { layout: layoutTemplates[2], durationMin: 10 },
    ],
    schedule: 'Sáb–Dom · Todo el día'
  },
];

export default function LayoutsPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'sequences'>('sequences');

  return (
    <div>
      <Topbar title="Layouts & Secuencias" subtitle="Diseña distribuciones de pantalla y programa cuándo aplican" />

      <div style={{ padding: '28px 32px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px', width: 'fit-content' }}>
          {[
            { key: 'sequences', label: 'Secuencias' },
            { key: 'templates', label: 'Plantillas de Layout' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
              padding: '8px 20px', borderRadius: '9px', border: 'none',
              fontWeight: 600, fontSize: '13.5px', cursor: 'pointer',
              transition: 'all 0.18s',
              background: activeTab === tab.key ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: activeTab === tab.key ? '#60a5fa' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.key ? '0 0 0 1px rgba(59,130,246,0.3)' : 'none',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'templates' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Plantillas de Layout</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Selecciona una base o crea tu distribución personalizada
                </p>
              </div>
              <button className="btn-primary"><Plus size={15} /> Nuevo Layout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {layoutTemplates.map((tpl) => (
                <div key={tpl.id} className="glass-card glass-card-hover" style={{ padding: '20px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <LayoutPreview layout={tpl} size={110} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{tpl.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {tpl.zoneCount} zona{tpl.zoneCount !== 1 ? 's' : ''}
                      </p>
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {tpl.zones.map((z) => (
                          <div key={z.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: z.color, flexShrink: 0 }} />
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {z.label}: {z.w}×{z.h}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new */}
              <div className="glass-card" style={{
                padding: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '130px', border: '1px dashed rgba(255,255,255,0.12)',
                background: 'transparent', transition: 'all 0.2s'
              }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Plus size={24} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Crear Layout Custom</p>
                  <p style={{ fontSize: '11px', marginTop: '3px' }}>Drag & resize</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'sequences' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Secuencias de Layouts</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Define el orden y duración de layouts. Se ejecutan automáticamente en los dispositivos.
                </p>
              </div>
              <button className="btn-primary"><Plus size={15} /> Nueva Secuencia</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {exampleSequences.map((seq) => {
                const totalMin = seq.steps.reduce((a, s) => a + s.durationMin, 0);
                return (
                  <div key={seq.id} className="glass-card glass-card-hover" style={{ padding: '24px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{seq.name}</h3>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {seq.schedule}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Timer size={12} /> {totalMin} min totales · loop
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Play size={12} /> {seq.deviceCount} dispositivos
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px' }}>
                          Editar
                        </button>
                        <button style={{
                          width: '34px', height: '34px', border: '1px solid var(--border)',
                          background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <MoreVertical size={15} color="var(--text-secondary)" />
                        </button>
                      </div>
                    </div>

                    {/* Steps flow */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {seq.steps.map((step, i) => (
                        <Fragment key={step.layout.id + i}>
                          <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                            padding: '14px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                            minWidth: '130px', flexShrink: 0
                          }}>
                            <LayoutPreview layout={step.layout} size={100} />
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{step.layout.name}</p>
                              <p style={{ fontSize: '11px', color: '#60a5fa', marginTop: '2px', fontWeight: 600 }}>
                                {step.durationMin} min
                              </p>
                            </div>
                          </div>
                          {i < seq.steps.length - 1 && (
                            <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          )}
                        </Fragment>
                      ))}

                      {/* Loop arrow */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', flexShrink: 0, padding: '8px' }}>
                        <ArrowRight size={16} />
                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#8b5cf6' }}>LOOP</span>
                      </div>
                    </div>

                    {/* Progress bar showing proportions */}
                    <div style={{ marginTop: '16px', display: 'flex', gap: '2px', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                      {seq.steps.map((step, i) => (
                        <div key={i} style={{
                          flex: step.durationMin,
                          background: ZONE_COLORS[i % ZONE_COLORS.length],
                          opacity: 0.7
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                      {seq.steps.map((step, i) => (
                        <span key={i} style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ZONE_COLORS[i % ZONE_COLORS.length], display: 'inline-block' }} />
                          {step.layout.name} ({Math.round(step.durationMin / totalMin * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
