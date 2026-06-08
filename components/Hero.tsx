'use client'

import { useLang } from '@/app/layout'

interface HeroProps { onExplore: () => void; onAdmin: () => void }

export default function Hero({ onExplore, onAdmin }: HeroProps) {
  const { t, lang } = useLang()

  return (
    <section style={{
      minHeight: '94vh', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '100px 24px 80px',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 20%,rgba(232,184,75,.09) 0%,transparent 65%),
                     radial-gradient(ellipse 40% 40% at 15% 80%,rgba(46,196,182,.06) 0%,transparent 60%),
                     radial-gradient(ellipse 40% 40% at 85% 70%,rgba(155,140,247,.06) 0%,transparent 60%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)`,
        backgroundSize: '52px 52px',
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 0%,black 30%,transparent 100%)',
      }} />

      {/* Eyebrow */}
      <div className="animate-fade-up" style={{
        display: 'inline-flex', alignItems: 'center', gap: 9,
        border: '1px solid rgba(232,184,75,.25)', background: 'rgba(232,184,75,.06)',
        borderRadius: 50, padding: '7px 18px',
        fontSize: 11, fontWeight: 600, color: 'var(--gold)',
        letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 36,
      }}>
        <div className="animate-pulse-dot" style={{
          width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%',
        }} />
        {t('heroEyebrow')}
      </div>

      {/* H1 */}
      <h1 className="animate-fade-up-1" style={{
        fontFamily: lang === 'ar' ? 'Noto Kufi Arabic, sans-serif' : 'Cormorant Garamond, serif',
        fontSize: 'clamp(52px,7vw,90px)', fontWeight: 700, lineHeight: 1.0,
        color: 'var(--snow)', maxWidth: 900, letterSpacing: '-.01em',
        ...(lang === 'ar' && { fontSize: 'clamp(36px,5.5vw,70px)', lineHeight: 1.2 }),
      }}>
        {t('heroH1').split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {i === 1 ? <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{line}</em> : line}
          </span>
        ))}
      </h1>

      {/* Lead */}
      <p className="animate-fade-up-2" style={{
        fontSize: 17, color: 'var(--mist)', maxWidth: 520,
        margin: '28px auto 44px', lineHeight: 1.75,
      }}>
        {t('heroLead')}
      </p>

      {/* CTAs */}
      <div className="animate-fade-up-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onExplore} className="btn-gold" style={{
          padding: '16px 32px', borderRadius: 12, fontSize: 15, border: 'none', cursor: 'pointer',
        }}>
          {t('heroCta1')}
        </button>
        <button onClick={onAdmin} style={{
          background: 'transparent', border: '1px solid var(--rim2)',
          color: 'var(--ghost)', padding: '16px 32px', borderRadius: 12, fontSize: 15,
          cursor: 'pointer', transition: '.2s',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold)' }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--rim2)'; el.style.color = 'var(--ghost)' }}
        >
          {t('heroCta2')}
        </button>
      </div>

      {/* Stats */}
      <div className="animate-fade-up-4" style={{
        display: 'flex', gap: 48, justifyContent: 'center',
        marginTop: 72, paddingTop: 48, borderTop: '1px solid var(--rim)',
      }}>
        {[
          { num: '2,400+', lbl: t('stat1') },
          { num: '180+',   lbl: t('stat2') },
          { num: '98%',    lbl: t('stat3') },
        ].map(({ num, lbl }) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 36, fontWeight: 700, color: 'var(--gold)', lineHeight: 1,
            }}>{num}</div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginTop: 4, letterSpacing: '.04em', textTransform: 'uppercase' }}>{lbl}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
