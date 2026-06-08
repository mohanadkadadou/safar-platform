'use client'

import { useState } from 'react'
import { useLang } from '@/app/layout'
import { useAuth } from '@/app/layout'

interface Props { onClose: () => void; onSuccess: () => void }

export default function AdminLoginModal({ onClose, onSuccess }: Props) {
  const { t, lang } = useLang()
  const { setAdmin } = useAuth()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  async function submit() {
    setLoading(true)
    // Verify against API route (keeps password server-side)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    setLoading(false)
    if (res.ok) {
      setAdmin(true)
      onSuccess()
    } else {
      setErr(true)
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(8,8,14,.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--rim)',
        borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400,
      }}>
        {/* Logo */}
        <div style={{
          width: 54, height: 54, borderRadius: 14,
          background: 'linear-gradient(135deg,#e8b84b,#c99a2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: '#08080e', fontWeight: 800,
          fontFamily: 'Cormorant Garamond, serif',
          margin: '0 auto 24px',
        }}>✦</div>

        <div style={{
          fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
          fontSize: 26, fontWeight: 700, color: 'var(--snow)', textAlign: 'center', marginBottom: 5,
        }}>{t('loginTitle')}</div>
        <div style={{ fontSize: 13, color: 'var(--fog)', textAlign: 'center', marginBottom: 32 }}>{t('loginSub')}</div>

        {/* Email (decorative) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t('emailLabel')}</label>
          <input
            className="safar-input"
            type="email"
            defaultValue="admin@safar.io"
            readOnly
            style={{ opacity: .7 }}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t('passLabel')}</label>
          <input
            className={`safar-input ${shake ? 'animate-shake' : ''}`}
            type="password"
            placeholder="••••••••••"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false) }}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
            style={err ? { borderColor: 'var(--coral)' } : {}}
          />
          {err && <span style={{ fontSize: 12, color: 'var(--coral)' }}>{t('loginErr')}</span>}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="btn-gold"
          style={{ width: '100%', padding: 13, borderRadius: 9, fontSize: 14, border: 'none', cursor: 'pointer', marginTop: 6 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div className="loader" style={{ width: 16, height: 16, borderWidth: 1.5 }} /> {lang === 'ar' ? 'جاري الدخول...' : 'Signing in...'}
            </span>
          ) : t('loginBtn')}
        </button>

        <div style={{ fontSize: 11, color: 'var(--fog)', textAlign: 'center', marginTop: 18 }}>{t('loginHint')}</div>
        <div style={{ fontSize: 11, color: 'var(--fog)', textAlign: 'center', marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--rim)' }}>
          Project Manager: <span style={{ color: 'var(--gold)' }}>Mohanad Kadadou</span>
        </div>
      </div>
    </div>
  )
}
