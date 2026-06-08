'use client'

import { useState } from 'react'
import { EVENT_COLORS, INV_BG, generateRefCode } from '@/lib/constants'
import { useLang } from '@/app/layout'
import type { Event } from '@/types'

interface Props { event: Event; onBack: () => void; onDone: () => void }

interface RegData {
  pkg: string; date: string; time: string;
  name: string; phone: string; notes: string;
  ref: string;
}

export default function RegisterFlow({ event: ev, onBack, onDone }: Props) {
  const { t, lang } = useLang()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<RegData>({
    pkg: ev.pkg_name ?? 'Standard',
    date: ev.date ?? '',
    time: ev.time ?? '08:00',
    name: '', phone: '', notes: '', ref: '',
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const steps = Array.isArray(t('regSteps')) ? t('regSteps').split(',') : ['Package', 'Date', 'Time', 'Details', 'Done']
  const times = [ev.time ?? '08:00', '10:00', '12:00']
  const dates = ev.date ? [ev.date] : []
  const priceStr = ev.price > 0 ? `$${ev.price}` : ev.price === 0 ? t('free') : ''

  async function submit() {
    if (!data.name.trim() || !data.phone.trim()) { setErr(t('required')); return }
    setLoading(true)
    const ref = generateRefCode()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: ev.id,
        name: data.name.trim(),
        phone: data.phone.trim(),
        notes: data.notes,
        package_name: data.pkg,
        chosen_date: data.date || null,
        chosen_time: data.time || null,
        ref_code: ref,
      }),
    })
    setLoading(false)
    if (res.ok) { setData(d => ({ ...d, ref })); setStep(4) }
    else { setErr(lang === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Error, please try again') }
  }

  const stepCircle = (i: number) => {
    const done = i < step, active = i === step
    return (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
        {i < steps.length - 1 && (
          <div style={{ position: 'absolute', top: 15, left: '50%', width: '100%', height: 1, background: 'var(--rim)' }} />
        )}
        <div style={{
          width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, zIndex: 1, transition: '.2s',
          background: done ? 'var(--sage)' : active ? 'var(--gold)' : 'var(--ink3)',
          border: done || active ? 'none' : '1px solid var(--rim)',
          color: done || active ? 'var(--ink)' : 'var(--fog)',
        }}>{done ? '✓' : i + 1}</div>
        <div style={{ fontSize: 10, color: 'var(--fog)', marginTop: 6, textAlign: 'center', letterSpacing: '.02em' }}>{steps[i]}</div>
      </div>
    )
  }

  const chip = (label: string, sel: boolean, onClick: () => void) => (
    <span key={label} onClick={onClick} style={{
      background: sel ? 'rgba(232,184,75,.1)' : 'var(--ink3)',
      border: `1px solid ${sel ? 'rgba(232,184,75,.4)' : 'var(--rim)'}`,
      color: sel ? 'var(--gold)' : 'var(--mist)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', transition: '.18s',
    }}>{label}</span>
  )

  const navRow = (backFn?: () => void, nextFn?: () => void, nextLabel?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 }}>
      {backFn ? (
        <button onClick={backFn} style={{ background: 'transparent', border: '1px solid var(--rim)', color: 'var(--mist)', padding: '10px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
          {t('backStep')}
        </button>
      ) : <span />}
      {nextFn && (
        <button onClick={nextFn} className="btn-gold" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer' }}>
          {nextLabel ?? t('nextStep')}
        </button>
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '40px 20px 60px' }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
        {steps.map((_, i) => stepCircle(i))}
      </div>

      {/* Card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 24, padding: 32 }}>

        {/* Step 0 — Package */}
        {step === 0 && (
          <>
            <RegTitle title={t('selectPkg')} sub={t('subPkg')} lang={lang} />
            <div style={{ border: '1px solid rgba(232,184,75,.5)', background: 'rgba(232,184,75,.05)', borderRadius: 10, padding: 15 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--snow)', marginBottom: 4 }}>{ev.pkg_name ?? 'Standard'}</div>
              {ev.items && <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: priceStr ? 8 : 0, lineHeight: 1.6 }}>{ev.items}</div>}
              {priceStr && <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{priceStr}</div>}
            </div>
            {navRow(undefined, () => setStep(1))}
          </>
        )}

        {/* Step 1 — Date */}
        {step === 1 && (
          <>
            <RegTitle title={t('selectDate')} sub={t('subDate')} lang={lang} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {dates.length > 0
                ? dates.map(d => chip(d, d === data.date, () => setData(x => ({ ...x, date: d }))))
                : <span style={{ fontSize: 13, color: 'var(--fog)' }}>{t('noDateSet')}</span>
              }
            </div>
            {navRow(() => setStep(0), () => setStep(2))}
          </>
        )}

        {/* Step 2 — Time */}
        {step === 2 && (
          <>
            <RegTitle title={t('selectTime')} sub={t('subTime')} lang={lang} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {times.map(tm => chip(tm, tm === data.time, () => setData(x => ({ ...x, time: tm }))))}
            </div>
            {navRow(() => setStep(1), () => setStep(3))}
          </>
        )}

        {/* Step 3 — Details */}
        {step === 3 && (
          <>
            <RegTitle title={t('yourDetails')} sub={t('subDetails')} lang={lang} />
            {[
              { label: `${t('nameLabel')} *`,  key: 'name',  ph: t('namePh'),  type: 'text' },
              { label: `${t('phoneLabel')} *`, key: 'phone', ph: t('phonePh'), type: 'tel' },
            ].map(({ label, key, ph, type }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 13 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</label>
                <input
                  className="safar-input"
                  type={type}
                  placeholder={ph}
                  value={(data as any)[key]}
                  onChange={e => { setData(d => ({ ...d, [key]: e.target.value })); setErr('') }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t('notesLabel')}</label>
              <textarea
                className="safar-input"
                placeholder={t('notesPh')}
                value={data.notes}
                onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
                style={{ resize: 'vertical', minHeight: 80 }}
              />
            </div>
            {err && <div style={{ fontSize: 12, color: 'var(--coral)', marginBottom: 4 }}>{err}</div>}
            {navRow(() => setStep(2), submit, loading ? (lang === 'ar' ? 'جاري الحجز...' : 'Booking...') : t('confirmBook'))}
          </>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
              <div style={{
                fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
                fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5,
              }}>{t('bookingDone')}</div>
              <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{t('subDone')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>{t('invReady')}</div>
            </div>

            {/* Invitation card */}
            <div style={{ maxWidth: 320, margin: '0 auto 16px', borderRadius: 18, overflow: 'hidden', background: INV_BG[ev.color_index % INV_BG.length] }}>
              <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{ev.emoji}</div>
                <div style={{
                  fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
                  fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4,
                }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>{ev.subtitle ?? ev.category}</div>
              </div>
              <div style={{ padding: '4px 24px 16px' }}>
                {[
                  [t('nameLabel'),    data.name],
                  [lang === 'ar' ? 'التاريخ' : 'Date', data.date || '—'],
                  [lang === 'ar' ? 'الوقت' : 'Time',   data.time || '—'],
                  [lang === 'ar' ? 'الباقة' : 'Package', data.pkg],
                  ...(priceStr ? [[lang === 'ar' ? 'السعر' : 'Price', priceStr]] : []),
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(255,255,255,.4)' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 24px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 9, margin: '0 auto 8px',
                  background: 'rgba(255,255,255,.08)', border: '1px dashed rgba(255,255,255,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.04em',
                }}>QR</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em' }}>{data.ref}</div>
              </div>
            </div>

            {/* Share buttons */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
              {['⬇ PNG', '📄 PDF', `💬 ${lang === 'ar' ? 'واتساب' : 'WhatsApp'}`].map(label => (
                <button key={label} style={{
                  flex: 1, padding: 10, borderRadius: 8,
                  border: '1px solid var(--rim2)', background: 'var(--card2)',
                  color: 'var(--snow)', fontSize: 12, cursor: 'pointer', transition: '.18s',
                }}>{label}</button>
              ))}
            </div>

            <button onClick={onDone} style={{
              width: '100%', padding: '10px 20px', borderRadius: 8, fontSize: 13,
              background: 'transparent', border: '1px solid var(--rim)', color: 'var(--mist)', cursor: 'pointer',
            }}>{t('backHome')}</button>
          </>
        )}
      </div>
    </div>
  )
}

function RegTitle({ title, sub, lang }: { title: string; sub: string; lang: string }) {
  return (
    <>
      <div style={{
        fontFamily: lang === 'ar' ? 'Noto Kufi Arabic' : 'Cormorant Garamond, serif',
        fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5,
      }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{sub}</div>
    </>
  )
}
