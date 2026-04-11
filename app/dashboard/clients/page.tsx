import Topbar from '@/components/Topbar';

export default function Page() {
  return (
    <div>
      <Topbar title="Próximamente" subtitle="Esta sección está en desarrollo" />
      <div style={{ padding: '60px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <p style={{ fontSize: '16px', fontWeight: 600 }}>En construcción</p>
        <p style={{ fontSize: '13px', marginTop: '6px' }}>Esta pantalla se desarrollará en la próxima iteración.</p>
      </div>
    </div>
  );
}
