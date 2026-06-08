'use client'

import { useState } from 'react'
import { FEATURES, THEMES, TESTIMONIALS } from '@/lib/constants'
import { useLang } from '@/app/layout'

// ── FEATURES ─────────────────────────────────────────────
export function FeaturesSection() {
  const { t, lang } = useLang()
  return (
    <div style={{ padding: '88px 32px', maxWidth: 1140, margin: '0 auto' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        border: '1px solid rgba(232,184,75,.2)', background: 'rgba(232,184,75,.05)',
        borderRadius: 50, padding: '5px 14px', fontSize: 10, fontWeight: 700,
        color: 'var(--gold)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18,
      }}>{t('sec3Tag')}</div>
      <h2 style={{
        fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
        fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--snow)', marginBottom: 44, lineHeight: 1.08,
      }}>
        {lang === 'en' ? <>Everything You <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Need</em></> : t('sec3Title')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 28, transition: '.22s',
          }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(232,184,75,.25)'; el.style.transform = 'translateY(-3px)' }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--rim)'; el.style.transform = 'none' }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, marginBottom: 18, background: f.bg,
            }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--snow)', marginBottom: 8 }}>
              {lang === 'ar' ? f.ar.t : f.en.t}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fog)', lineHeight: 1.7 }}>
              {lang === 'ar' ? f.ar.d : f.en.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── THEMES ────────────────────────────────────────────────
export function ThemesSection() {
  const { t, lang } = useLang()
  const [active, setActive] = useState(0)
  return (
    <div style={{ background: 'var(--ink2)', borderTop: '1px solid var(--rim)', borderBottom: '1px solid var(--rim)' }}>
      <div style={{ padding: '88px 32px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          border: '1px solid rgba(232,184,75,.2)', background: 'rgba(232,184,75,.05)',
          borderRadius: 50, padding: '5px 14px', fontSize: 10, fontWeight: 700,
          color: 'var(--gold)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18,
        }}>{t('sec4Tag')}</div>
        <h2 style={{
          fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
          fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--snow)', marginBottom: 14, lineHeight: 1.08,
        }}>
          {lang === 'en' ? <>Unique <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Identity</em> per Event</> : t('sec4Title')}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.8, marginBottom: 36 }}>{t('sec4Lead')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
          {THEMES.map((th, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
              border: `2px solid ${active === i ? 'var(--gold)' : 'transparent'}`,
              boxShadow: active === i ? '0 0 0 2px rgba(232,184,75,.15)' : 'none',
              transition: '.22s',
            }}>
              <div style={{
                height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, background: th.bg, position: 'relative',
              }}>
                <span>{th.emoji}</span>
                <span style={{
                  position: 'absolute', bottom: 8, right: 10,
                  fontSize: 10, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)',
                  padding: '3px 8px', borderRadius: 4, color: 'rgba(255,255,255,.7)', letterSpacing: '.04em',
                }}>PREVIEW</span>
              </div>
              <div style={{ background: 'var(--card)', padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--snow)', marginBottom: 6 }}>
                  {lang === 'ar' ? th.name.ar : th.name.en}
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[th.p, th.s, th.a].map((c, j) => (
                    <div key={j} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TESTIMONIALS ──────────────────────────────────────────
export function TestimonialsSection() {
  const { t, lang } = useLang()
  const avBg = ['rgba(46,196,182,.2)', 'rgba(232,184,75,.2)', 'rgba(155,140,247,.2)']
  return (
    <div style={{ padding: '88px 32px', maxWidth: 1140, margin: '0 auto' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        border: '1px solid rgba(232,184,75,.2)', background: 'rgba(232,184,75,.05)',
        borderRadius: 50, padding: '5px 14px', fontSize: 10, fontWeight: 700,
        color: 'var(--gold)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18,
      }}>{t('sec5Tag')}</div>
      <h2 style={{
        fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
        fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--snow)', marginBottom: 44, lineHeight: 1.08,
      }}>
        {lang === 'en' ? <>What Participants <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Say</em></> : t('sec5Title')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
        {TESTIMONIALS.map((t_, i) => {
          const d = lang === 'ar' ? t_.ar : t_.en
          return (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 28 }}>
              <div style={{ color: 'var(--gold)', fontSize: 13, marginBottom: 14, letterSpacing: 3 }}>{'★'.repeat(t_.stars)}</div>
              <p style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>"{d.t}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: avBg[i], display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>{d.n.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--snow)' }}>{d.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--fog)', marginTop: 2 }}>{d.r}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── CTA ───────────────────────────────────────────────────
export function CTASection({ onExplore }: { onExplore: () => void }) {
  const { t, lang } = useLang()
  return (
    <div style={{
      padding: '100px 32px', textAlign: 'center',
      background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(232,184,75,.07) 0%,transparent 70%)',
      borderTop: '1px solid var(--rim)',
    }}>
      <h2 style={{
        fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
        fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700, color: 'var(--snow)', marginBottom: 14, lineHeight: 1.05,
      }}>
        {lang === 'en' ? <>Ready to Start<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Your Adventure?</em></> : t('ctaTitle')}
      </h2>
      <p style={{ fontSize: 16, color: 'var(--mist)', marginBottom: 36 }}>{t('ctaLead')}</p>
      <button onClick={onExplore} className="btn-gold" style={{ padding: '16px 32px', borderRadius: 12, fontSize: 15, border: 'none', cursor: 'pointer' }}>
        {t('ctaBtn')}
      </button>
    </div>
  )
}

// ── FOOTER ────────────────────────────────────────────────
export function Footer({
  onHome, onEvents, onAdmin,
}: { onHome: () => void; onEvents: () => void; onAdmin: () => void }) {
  const { t, lang } = useLang()
  const linkStyle = {
    display: 'block', fontSize: 13, color: 'var(--fog)', padding: '4px 0', cursor: 'pointer', transition: '.15s',
  }
  return (
    <footer style={{ background: 'var(--ink2)', borderTop: '1px solid var(--rim)', padding: '56px 32px 32px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'linear-gradient(135deg,#e8b84b,#c99a2e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#08080e', fontWeight: 800,
              }}>✦</div>
              <span style={{
                fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
                fontSize: 22, fontWeight: 600, color: 'var(--snow)',
              }}>{lang === 'ar' ? 'سفر' : 'Safar'}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--fog)', lineHeight: 1.75 }}>{t('footDesc')}</p>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>{t('fc1')}</div>
            <a style={linkStyle} onClick={onHome}>{t('home')}</a>
            <a style={linkStyle} onClick={onEvents}>{t('events')}</a>
            <a style={linkStyle} onClick={onAdmin}>{t('adminLogin')}</a>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>{t('fc2')}</div>
            <a style={linkStyle}>{t('fl1')}</a>
            <a style={linkStyle}>{t('fl2')}</a>
            <a style={linkStyle}>{t('fl3')}</a>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>{t('fc3')}</div>
            <a style={linkStyle}>hello@safar.io</a>
            <a style={linkStyle}>@safar</a>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 28, borderTop: '1px solid var(--rim)', fontSize: 12, color: 'var(--fog)',
        }}>
          <span>{t('footCopy')}</span>
          <span>{t('footCredit')}<span style={{ color: 'var(--gold)' }}>Mohanad Kadadou</span></span>
        </div>
      </div>
    </footer>
  )
}

export default FeaturesSection
