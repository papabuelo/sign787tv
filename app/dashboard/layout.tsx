import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

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

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar userEmail={user.email ?? ''} userName={profile?.full_name ?? 'Admin'} userRole={profile?.role ?? 'client'} />
      <main className="main-content" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  )
}
