'use client'

import { useLang } from '@/app/layout'
import { useAuth } from '@/app/layout'

interface NavbarProps {
  onHome: () => void
  onEvents: () => void
  onLoginClick: () => void
  onDashClick: () => void
}

export default function Navbar({ onHome, onEvents, onLoginClick, onDashClick }: NavbarProps) {
  const { t, toggleLang, lang } = useLang()
  const { isAdmin } = useAuth()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: '62px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 32px',
      background: 'rgba(8,8,14,.92)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(232,184,75,.1)',
    }}>
      {/* Brand */}
      <div onClick={onHome} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'linear-gradient(135deg,#e8b84b,#c99a2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: '#08080e', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif',
        }}>✦</div>
        <span style={{
          fontFamily: lang === 'ar' ? 'Noto Kufi Arabic, sans-serif' : 'Cormorant Garamond, serif',
          fontSize: lang === 'ar' ? 19 : 22, fontWeight: 600, color: 'var(--snow)',
        }}>
          {t('home') === 'الرئيسية' ? 'سفر' : 'Safar'}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {[
          { label: t('home'), fn: onHome },
          { label: t('events'), fn: onEvents },
        ].map(({ label, fn }) => (
          <button key={label} onClick={fn} style={{
            padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500,
            color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer',
            transition: '.18s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--snow)'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,.07)' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--mist)'; (e.target as HTMLElement).style.background = 'none' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={toggleLang} style={{
          padding: '5px 12px', borderRadius: 20,
          background: 'rgba(232,184,75,.08)', border: '1px solid rgba(232,184,75,.2)',
          color: 'var(--gold)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          letterSpacing: '.04em', transition: '.18s',
        }}>
          {lang === 'en' ? 'ع' : 'EN'}
        </button>

        {isAdmin ? (
          <button onClick={onDashClick} className="btn-gold" style={{
            padding: '9px 20px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer',
          }}>
            {t('dashboard')}
          </button>
        ) : (
          <button onClick={onLoginClick} className="btn-gold" style={{
            padding: '9px 20px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer',
          }}>
            {t('adminLogin')}
          </button>
        )}
      </div>
    </nav>
  )
}
