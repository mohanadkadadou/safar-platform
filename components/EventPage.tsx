'use client'

import { useEffect, useState } from 'react'
import { EVENT_COLORS } from '@/lib/constants'
import { useLang } from '@/app/layout'
import type { Event } from '@/types'

interface Props { event: Event; onBack: () => void; onRegister: (ev: Event) => void }

export default function EventPage({ event: ev, onBack, onRegister }: Props) {
  const { t, lang } = useLang()
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [selDate, setSelDate] = useState(ev.date ?? '')
  const [selTime, setSelTime] = useState(ev.time ?? '08:00')
  const cl = EVENT_COLORS[ev.color_index % EVENT_COLORS.length]
  const times = [ev.time ?? '08:00', '10:00', '12:00']
  const dates = ev.date ? [ev.date] : []
  const priceStr = ev.price > 0 ? `$${ev.price}` : ev.price === 0 ? t('free') : ''

  const statusLabel: Record<string, string> = {
    published: t('statusPublished'), voting: t('statusVoting'),
    draft: t('statusDraft'), closed: t('statusClosed'),
  }

  useEffect(() => {
    const target = ev.date ? new Date(ev.date) : new Date(Date.now() + 14 * 864e5)
    const upd = () => {
      const diff = +target - Date.now()
      if (diff < 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return }
      setCd({
        d: Math.floor(diff / 864e5),
        h: Math.floor(diff % 864e5 / 36e5),
        m: Math.floor(diff % 36e5 / 6e4),
        s: Math.floor(diff % 6e4 / 1e3),
      })
    }
    upd()
    const id = setInterval(upd, 1000)
    return () => clearInterval(id)
  }, [ev.date])

  function jiggleNo(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget
    const dx = (Math.random() - .5) * 100
    const dy = (Math.random() - .5) * 24
    el.style.transform = `translate(${dx}px,${dy}px)`
    setTimeout(() => { el.style.transform = 'translate(0,0)' }, 700)
  }

  const chip = (label: string, sel: boolean, onClick: () => void) => (
    <span key={label} onClick={onClick} style={{
      background: sel ? 'rgba(232,184,75,.1)' : 'var(--ink3)',
      border: `1px solid ${sel ? 'rgba(232,184,75,.4)' : 'var(--rim)'}`,
      color: sel ? 'var(--gold)' : 'var(--mist)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', transition: '.18s',
    }}>{label}</span>
  )

  return (
    <div>
      {/* Hero */}
      <div style={{ minHeight: 380, display: 'flex', alignItems: 'flex-end', padding: 32, position: 'relative', overflow: 'hidden', background: cl.bg }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 130, filter: 'blur(2px)', transform: 'scale(1.12)' }}>
          {ev.emoji}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,8,14,.92) 0%,rgba(8,8,14,.3) 60%,transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.12)', color: '#fff',
            padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
            marginBottom: 16, transition: '.18s',
          }}>{t('backBtn')}</button>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: 'rgba(8,8,14,.7)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.08)', color: 'var(--ghost)',
            }}>{ev.category}</span>
            <span className={`status-${ev.status}`} style={{ padding: '4px 11px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              {statusLabel[ev.status] ?? ev.status}
            </span>
          </div>
          <div style={{
            fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
            fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: '#fff', marginBottom: 8,
          }}>{ev.title}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)' }}>
            {ev.subtitle} {ev.date ? `· ${ev.date}` : ''}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          {/* About */}
          {ev.description && (
            <PubSection title={t('aboutEvent')}>
              <p style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.85 }}>{ev.description}</p>
            </PubSection>
          )}

          {/* Countdown */}
          <PubSection title={t('countdown')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[
                { n: cd.d, l: t('days') }, { n: cd.h, l: t('hours') },
                { n: cd.m, l: t('mins') }, { n: cd.s, l: t('secs') },
              ].map(({ n, l }) => (
                <div key={l} style={{ background: 'var(--ink3)', border: '1px solid var(--rim)', borderRadius: 9, padding: '14px 8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 700, color: 'var(--snow)', lineHeight: 1 }}>
                    {String(n).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </PubSection>

          {/* Dates */}
          {dates.length > 0 && (
            <PubSection title={lang === 'ar' ? 'التاريخ' : 'Date'}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {dates.map(d => chip(d, d === selDate, () => setSelDate(d)))}
              </div>
            </PubSection>
          )}

          {/* Times */}
          <PubSection title={t('departureTimes')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {times.map(tm => chip(tm, tm === selTime, () => setSelTime(tm)))}
            </div>
          </PubSection>

          {/* Included */}
          {ev.items && (
            <PubSection title={t('included')}>
              <ul style={{ listStyle: 'none' }}>
                {ev.items.split(',').map(item => (
                  <li key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: 'var(--mist)', padding: '8px 0',
                    borderBottom: '1px solid rgba(44,44,68,.6)',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(123,198,126,.12)', border: '1px solid rgba(123,198,126,.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'var(--sage)', flexShrink: 0,
                    }}>✓</div>
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </PubSection>
          )}

          {/* Meeting point */}
          {ev.meeting_point && (
            <PubSection title={t('meetPoint')}>
              <div style={{ background: 'var(--ink3)', border: '1px solid var(--rim)', borderRadius: 8, padding: 14, fontSize: 13, color: 'var(--mist)' }}>
                📍 {ev.meeting_point}
              </div>
            </PubSection>
          )}
        </div>

        {/* Booking card */}
        <div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 24, position: 'sticky', top: 78 }}>
            {priceStr && (
              <>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 34, fontWeight: 700, color: 'var(--gold)', lineHeight: 1, marginBottom: 3 }}>{priceStr}</div>
                <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 20 }}>{t('perPerson')}</div>
              </>
            )}
            {ev.pkg_name && (
              <div style={{ border: '1px solid rgba(232,184,75,.5)', background: 'rgba(232,184,75,.05)', borderRadius: 10, padding: 15, marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--snow)', marginBottom: 4 }}>{ev.pkg_name}</div>
                {ev.items && <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: priceStr ? 8 : 0, lineHeight: 1.6 }}>{ev.items}</div>}
                {priceStr && <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{priceStr}</div>}
              </div>
            )}

            {ev.status === 'published' ? (
              <>
                <button onClick={() => onRegister(ev)} className="btn-gold" style={{
                  width: '100%', padding: 15, borderRadius: 11, fontSize: 15,
                  border: 'none', cursor: 'pointer', marginTop: 16, position: 'relative', overflow: 'hidden',
                }}>
                  {t('bookBtn')}
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🎉</span>
                </button>
                <div style={{ textAlign: 'center', marginTop: 12, minHeight: 28, position: 'relative' }}>
                  <button onMouseOver={jiggleNo} style={{
                    fontSize: 12, color: 'var(--fog)', background: 'none',
                    border: 'none', cursor: 'pointer', transition: 'all .25s ease', display: 'inline-block',
                  }}>{t('noBtn')}</button>
                </div>
              </>
            ) : (
              <div style={{ background: 'rgba(232,184,75,.07)', border: '1px solid rgba(232,184,75,.2)', borderRadius: 9, padding: 14, fontSize: 13, color: 'var(--gold)', textAlign: 'center', marginTop: 12 }}>
                {t('notPublished')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}
