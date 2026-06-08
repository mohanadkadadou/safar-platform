'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { EVENT_COLORS } from '@/lib/constants'
import { useLang } from '@/app/layout'
import type { Event } from '@/types'

interface Props { onEventClick: (ev: Event) => void }

export default function EventsGrid({ onEventClick }: Props) {
  const { t, lang } = useLang()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: true })
      setEvents(data ?? [])
      setLoading(false)
    }
    load()
    // Realtime subscription
    const sub = supabase.channel('events-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  return (
    <div style={{ padding: '88px 32px', maxWidth: 1140, margin: '0 auto' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        border: '1px solid rgba(232,184,75,.2)', background: 'rgba(232,184,75,.05)',
        borderRadius: 50, padding: '5px 14px',
        fontSize: 10, fontWeight: 700, color: 'var(--gold)',
        letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18,
      }}>
        {t('sec1Tag')}
      </div>

      <h2 style={{
        fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
        fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--snow)',
        marginBottom: 14, lineHeight: 1.08,
      }}>
        {t('sec1Title').replace('Events', '')}
        <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
          {lang === 'en' ? 'Events' : ''}
        </em>
      </h2>

      <p style={{ fontSize: 15, color: 'var(--mist)', marginBottom: 0, lineHeight: 1.8 }}>
        {t('sec1Lead')}
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="loader" />
        </div>
      ) : events.length === 0 ? (
        <div style={{
          gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', marginTop: 44,
        }}>
          <div style={{ fontSize: 40, opacity: .2, marginBottom: 16 }}>◈</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--mist)', marginBottom: 6 }}>
            {lang === 'ar' ? 'لا توجد فعاليات منشورة حالياً' : 'No published events yet'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fog)' }}>
            {lang === 'ar' ? 'تابع قريباً!' : 'Check back soon!'}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
          gap: 20, marginTop: 44,
        }}>
          {events.map((ev) => {
            const cl = EVENT_COLORS[ev.color_index % EVENT_COLORS.length]
            const priceStr = ev.price > 0 ? `$${ev.price}` : ev.price === 0 ? t('free') : ''
            return (
              <div key={ev.id}
                onClick={() => onEventClick(ev)}
                style={{
                  background: 'var(--card)', border: '1px solid var(--rim)',
                  borderRadius: 24, overflow: 'hidden', cursor: 'pointer', transition: '.25s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(232,184,75,.4)'
                  el.style.transform = 'translateY(-5px)'
                  el.style.boxShadow = '0 20px 48px rgba(0,0,0,.5)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--rim)'
                  el.style.transform = 'none'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Thumb */}
                <div style={{
                  height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: cl.bg, position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(255,255,255,.06),transparent 70%)',
                  }} />
                  <div className="animate-float" style={{ fontSize: 64 }}>{ev.emoji}</div>
                  <span style={{
                    position: 'absolute', top: 14, left: 14,
                    padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                    background: 'rgba(8,8,14,.7)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,.08)', color: 'var(--ghost)',
                  }}>{ev.category}</span>
                  <span className={`status-${ev.status}`} style={{
                    position: 'absolute', top: 14, right: 14,
                    padding: '4px 11px', borderRadius: 20, fontSize: 10,
                    fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                  }}>
                    {lang === 'ar' ? 'منشورة' : 'Open'}
                  </span>
                </div>

                <div style={{ padding: 18 }}>
                  <div style={{
                    fontSize: 16, fontWeight: 600, color: 'var(--snow)', marginBottom: 5,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 14 }}>{ev.subtitle}</div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px', borderTop: '1px solid var(--rim)',
                }}>
                  <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 600, color: 'var(--gold)' }}>
                    {priceStr}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--fog)' }}>
                    {ev.date ? `📅 ${ev.date}` : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
