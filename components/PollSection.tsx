'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { POLL_OPTIONS } from '@/lib/constants'
import { useLang } from '@/app/layout'

export default function PollSection() {
  const { t, lang } = useLang()
  const [votes, setVotes] = useState<Record<number, number>>({})
  const [myVote, setMyVote] = useState<number | null>(null)
  const total = Object.values(votes).reduce((a, b) => a + b, 0)

  useEffect(() => {
    // Load votes
    supabase.from('poll_votes').select('option_index').then(({ data }) => {
      const counts: Record<number, number> = {}
      data?.forEach(v => { counts[v.option_index] = (counts[v.option_index] || 0) + 1 })
      setVotes(counts)
    })
    // Check if voted
    const saved = localStorage.getItem('safar_vote')
    if (saved) setMyVote(Number(saved))
    // Realtime
    const sub = supabase.channel('poll-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, (payload) => {
        const idx = payload.new.option_index as number
        setVotes(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }))
      })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  async function vote(i: number) {
    if (myVote !== null) return
    setMyVote(i)
    setVotes(prev => ({ ...prev, [i]: (prev[i] || 0) + 1 }))
    localStorage.setItem('safar_vote', String(i))
    await supabase.from('poll_votes').insert({ option_index: i })
  }

  return (
    <div style={{ background: 'var(--ink2)', borderTop: '1px solid var(--rim)', borderBottom: '1px solid var(--rim)' }}>
      <div style={{
        maxWidth: 1140, margin: '0 auto', padding: '88px 32px',
        display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'center',
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            border: '1px solid rgba(232,184,75,.2)', background: 'rgba(232,184,75,.05)',
            borderRadius: 50, padding: '5px 14px', fontSize: 10, fontWeight: 700,
            color: 'var(--gold)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18,
          }}>{t('sec2Tag')}</div>
          <h2 style={{
            fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
            fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--snow)',
            marginBottom: 14, lineHeight: 1.08,
          }}>
            {lang === 'en' ? <>Vote for Our<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Next Trip</em></> : t('sec2Title')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.8, marginBottom: 28 }}>{t('sec2Lead')}</p>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 12, color: 'var(--fog)', marginTop: 4, letterSpacing: '.04em', textTransform: 'uppercase' }}>{t('pollTotalLbl')}</div>
          </div>
        </div>

        {/* Poll card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 24, padding: 32 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--snow)', marginBottom: 24 }}>{t('pollQ')}</div>
          {POLL_OPTIONS.map((opt, i) => {
            const pct = total > 0 ? Math.round((votes[i] || 0) / total * 100) : 0
            const voted = myVote === i
            return (
              <div key={i} onClick={() => vote(i)} style={{
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 10,
                border: `1px solid ${voted ? 'rgba(232,184,75,.4)' : 'var(--rim)'}`,
                background: voted ? 'rgba(232,184,75,.05)' : 'var(--ink3)',
                cursor: myVote !== null ? 'default' : 'pointer',
                transition: '.18s', marginBottom: 10,
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${pct}%`, background: 'rgba(232,184,75,.06)', transition: 'width .8s cubic-bezier(.4,0,.2,1)',
                  pointerEvents: 'none',
                }} />
                <span style={{ fontSize: 22, position: 'relative', zIndex: 1, flexShrink: 0 }}>{opt.emoji}</span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--snow)', position: 'relative', zIndex: 1 }}>
                  {lang === 'ar' ? opt.label_ar : opt.label_en}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', position: 'relative', zIndex: 1 }}>
                  {total > 0 ? `${pct}%` : ''}
                </span>
              </div>
            )
          })}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--rim)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--fog)' }}>
              {total > 0 ? `${total} ${lang === 'ar' ? 'صوت' : 'votes'}` : t('pollCnt0')}
            </span>
            <button className="btn-gold" style={{ padding: '8px 18px', borderRadius: 7, fontSize: 12, border: 'none', cursor: 'pointer' }}>
              {lang === 'ar' ? 'تحويل إلى فعالية →' : 'Convert to Event →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
