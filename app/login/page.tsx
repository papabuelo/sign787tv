'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        top: '-150px', right: '-150px', filter: 'blur(60px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        bottom: '-100px', left: '-100px', filter: 'blur(60px)', pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 30px rgba(59,130,246,0.4)'
          }}>
            <Zap size={26} color="white" fill="white" />
          </div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px',
            background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            SIGN<span style={{ WebkitTextFillColor: '#3b82f6' }}>787</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Digital Signage CRM
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>
            Accede al panel de control
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sign787.com"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px', padding: '10px 14px',
                color: '#f87171', fontSize: '13px'
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Entrando...' : 'Entrar al CRM'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '20px' }}>
          © 2026 SIGN787 · Todos los derechos reservados
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
