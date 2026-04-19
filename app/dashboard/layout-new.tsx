import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import SidebarNew from '@/components/SidebarNew'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile for role/name
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  // Usar el nuevo sidebar por defecto
  const useNewSidebar = true

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {useNewSidebar ? (
        <SidebarNew userEmail={user.email ?? ''} userName={profile?.full_name ?? 'Admin'} userRole={profile?.role ?? 'client'} />
      ) : (
        <Sidebar userEmail={user.email ?? ''} userName={profile?.full_name ?? 'Admin'} userRole={profile?.role ?? 'client'} />
      )}
      <main className="main-content" style={{ 
        flex: 1, 
        position: 'relative', 
        zIndex: 1,
        marginLeft: useNewSidebar ? '280px' : '256px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  )
}