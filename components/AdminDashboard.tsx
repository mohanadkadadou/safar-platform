'use client'

import { useState, useEffect, useCallback } from 'react'
import { createAdminClient } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { EVENT_COLORS, CATEGORIES_EN, CATEGORIES_AR, POLL_OPTIONS } from '@/lib/constants'
import { useLang } from '@/app/layout'
import { useAuth } from '@/app/layout'
import type { Event, Registration, PollVote } from '@/types'

type Section = 'overview' | 'events' | 'new' | 'participants' | 'analytics' | 'polls'

interface Props {
  showToast: (msg: string) => void
  onViewEvent: (ev: Event) => void
}

export default function AdminDashboard({ showToast, onViewEvent }: Props) {
  const { t, lang } = useLang()
  const { setAdmin } = useAuth()
  const [section, setSection] = useState<Section>('overview')
  const [events, setEvents] = useState<Event[]>([])
  const [regs, setRegs] = useState<Registration[]>([])
  const [pollVotes, setPollVotes] = useState<PollVote[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [evRes, regRes, pollRes] = await Promise.all([
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('poll_votes').select('*'),
    ])
    setEvents(evRes.data ?? [])
    setRegs(regRes.data ?? [])
    setPollVotes(pollRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const publishEvent = async (id: string) => {
    await fetch('/api/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'published' }),
    })
    showToast(lang === 'ar' ? '✓ تم نشر الفعالية' : '✓ Event published')
    await load()
  }

  const deleteEvent = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Delete this event?')) return
    await fetch('/api/events', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    showToast(lang === 'ar' ? 'تم الحذف' : 'Deleted')
    await load()
  }

  const exportCSV = () => {
    const rows = [
      ['Name', 'Phone', 'Event', 'Package', 'Date', 'Time'],
      ...regs.map(r => {
        const ev = events.find(e => e.id === r.event_id) || {} as Event
        return [r.name, r.phone, ev.title || '', r.package_name || '', r.chosen_date || '', r.chosen_time || '']
      }),
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const b = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(b)
    a.download = 'safar-participants.csv'
    a.click()
  }

  const sbBtn = (id: Section, icon: string, label: string, badge?: number) => (
    <button
      key={id}
      onClick={() => setSection(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        color: section === id ? 'var(--gold)' : 'var(--mist)',
        background: section === id ? 'rgba(232,184,75,.1)' : 'none',
        border: 'none', cursor: 'pointer', width: '100%',
        textAlign: lang === 'ar' ? 'right' : 'left',
        transition: '.15s', marginBottom: 2,
      }}
    >
      <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? (
        <span style={{
          background: 'var(--coral)', color: '#fff', fontSize: 10,
          padding: '1px 6px', borderRadius: 10, lineHeight: '16px',
          marginLeft: lang === 'ar' ? 0 : 'auto', marginRight: lang === 'ar' ? 'auto' : 0,
        }}>{badge}</span>
      ) : null}
    </button>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 62px)' }}>

      {/* SIDEBAR */}
      <aside style={{
        background: 'var(--ink2)', borderRight: '1px solid var(--rim)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 62, height: 'calc(100vh - 62px)', overflowY: 'auto',
      }}>
        <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid var(--rim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg,rgba(232,184,75,.3),rgba(232,184,75,.1))',
              border: '1px solid rgba(232,184,75,.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: 'var(--gold)', flexShrink: 0,
            }}>M</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--snow)' }}>Mohanad K.</div>
              <div style={{ fontSize: 11, color: 'var(--fog)', marginTop: 1 }}>{t('sbRole')}</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.1em', padding: '0 10px', margin: '14px 0 6px' }}>
            {t('sbMain')}
          </div>
          {sbBtn('overview',   '◈', t('overview'))}
          {sbBtn('events',     '◫', t('eventsList'), events.length || undefined)}
          {sbBtn('new',        '⊕', t('newEvent'))}
          {sbBtn('participants','◎', t('participants'), regs.length || undefined)}
          {sbBtn('analytics',  '◬', t('analytics'))}
          {sbBtn('polls',      '◐', t('polls'))}
        </nav>

        <div style={{ padding: '12px 8px 16px', borderTop: '1px solid var(--rim)', marginTop: 'auto' }}>
          <button onClick={() => { setAdmin(false); window.location.reload() }} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'var(--fog)',
            background: 'none', border: 'none', cursor: 'pointer', width: '100%',
            textAlign: lang === 'ar' ? 'right' : 'left', transition: '.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--coral)'; e.currentTarget.style.background = 'rgba(255,107,107,.06)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--fog)'; e.currentTarget.style.background = 'none' }}
          >
            <span style={{ fontSize: 15 }}>↩</span>
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ padding: '28px 32px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader" style={{ width: 32, height: 32 }} /></div>
        ) : (
          <>
            {section === 'overview' && <DashOverview events={events} regs={regs} t={t} lang={lang} onNew={() => setSection('new')} />}
            {section === 'events' && <DashEvents events={events} regs={regs} t={t} lang={lang} onNew={() => setSection('new')} onPublish={publishEvent} onDelete={deleteEvent} onView={onViewEvent} />}
            {section === 'new' && <DashNew t={t} lang={lang} onSaved={async () => { await load(); setSection('events'); showToast(t('savedEv')) }} showToast={showToast} />}
            {section === 'participants' && <DashParticipants regs={regs} events={events} t={t} lang={lang} onExport={exportCSV} />}
            {section === 'analytics' && <DashAnalytics events={events} regs={regs} t={t} lang={lang} />}
            {section === 'polls' && <DashPolls pollVotes={pollVotes} t={t} lang={lang} />}
          </>
        )}
      </div>
    </div>
  )
}

// ── OVERVIEW ──────────────────────────────────────────────
function DashOverview({ events, regs, t, lang, onNew }: any) {
  const pub = events.filter((e: Event) => e.status === 'published').length
  const draft = events.filter((e: Event) => e.status === 'draft').length

  if (!events.length) return (
    <>
      <DashHead title={t('ovTitle')} sub={t('ovSub')} />
      <EmptyState icon="◈" title={t('noEvTitle')} desc={t('noEvDesc')} cta={t('createFirst')} onCta={onNew} />
    </>
  )

  return (
    <>
      <DashHead title={t('ovTitle')} sub={t('ovSub')} action={{ label: t('createNew'), fn: onNew }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { lbl: t('totalEvents'), val: events.length,  color: 'var(--snow)',   sc: 'rgba(232,184,75,.08)',  ico: '◫' },
          { lbl: t('published'),   val: pub,             color: 'var(--sage)',   sc: 'rgba(123,198,126,.08)', ico: '◈' },
          { lbl: t('totalRegs'),   val: regs.length,     color: 'var(--violet)', sc: 'rgba(155,140,247,.08)', ico: '◎' },
          { lbl: t('awaitingPub'), val: draft,           color: 'var(--teal)',   sc: 'rgba(46,196,182,.08)',  ico: '◬' },
        ].map(({ lbl, val, color, sc, ico }) => (
          <div key={lbl} style={{
            background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16,
            padding: 20, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg,${sc} 0%,transparent 60%)`,
              pointerEvents: 'none',
            }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>{lbl}</div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 28, opacity: .3 }}>{ico}</div>
          </div>
        ))}
      </div>
      {regs.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, overflow: 'hidden', marginTop: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--rim)', fontSize: 14, fontWeight: 600, color: 'var(--snow)' }}>{t('recentRegs')}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['colName','colEvent','colDate','colTime'].map(k => (
                <th key={k} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'left', borderBottom: '1px solid var(--rim)' }}>{t(k as any)}</th>
              ))}</tr>
            </thead>
            <tbody>
              {regs.slice(0, 5).map(r => {
                const ev = events.find((e: Event) => e.id === r.event_id) as Event | undefined
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(44,44,68,.6)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--mist)' }}>{ev?.title ?? '—'}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--fog)' }}>{r.chosen_date ?? '—'}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--fog)' }}>{r.chosen_time ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ── EVENTS LIST ───────────────────────────────────────────
function DashEvents({ events, regs, t, lang, onNew, onPublish, onDelete, onView }: any) {
  const statusClass: Record<string, string> = { published: 'sp', voting: 'sv', draft: 'sd', closed: 'sc' }
  const statusLabel: Record<string, string> = {
    published: t('statusPublished'), voting: t('statusVoting'),
    draft: t('statusDraft'), closed: t('statusClosed'),
  }
  if (!events.length) return (
    <>
      <DashHead title={t('allEvents')} action={{ label: t('createNew'), fn: onNew }} />
      <EmptyState icon="◫" title={t('noEvTitle')} desc={t('noEvDesc')} cta={t('createFirst')} onCta={onNew} />
    </>
  )
  return (
    <>
      <DashHead title={t('allEvents')} sub={`${events.length} ${lang === 'ar' ? 'فعالية' : 'events'}`} action={{ label: t('createNew'), fn: onNew }} />
      {events.map((ev: Event) => {
        const cl = EVENT_COLORS[ev.color_index % EVENT_COLORS.length]
        const regCount = regs.filter((r: Registration) => r.event_id === ev.id).length
        const meta = [ev.date, ev.time, regCount ? `${regCount} ${lang === 'ar' ? 'مشارك' : 'regs'}` : ''].filter(Boolean).join(' · ')
        return (
          <div key={ev.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '15px 18px', background: 'var(--card)',
            border: '1px solid var(--rim)', borderRadius: 16, marginBottom: 10, transition: '.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--rim2)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--rim)')}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, flexShrink: 0, background: cl.thumb,
            }}>{ev.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--snow)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: 'var(--fog)', marginTop: 2 }}>{meta}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span className={`status-${ev.status}`} style={{ padding: '4px 11px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {statusLabel[ev.status] ?? ev.status}
              </span>
              {ev.status === 'draft' && (
                <button onClick={() => onPublish(ev.id)} style={{
                  background: 'rgba(123,198,126,.12)', border: '1px solid rgba(123,198,126,.25)', color: 'var(--sage)',
                  padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', transition: '.18s',
                }}>{t('publishBtn')}</button>
              )}
              <button onClick={() => onView(ev)} style={{
                background: 'transparent', border: '1px solid var(--rim)', color: 'var(--mist)',
                padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', transition: '.18s',
              }}>{t('viewBtn')}</button>
              <button onClick={() => onDelete(ev.id)} style={{
                background: 'rgba(255,107,107,.12)', border: '1px solid rgba(255,107,107,.25)', color: 'var(--coral)',
                padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', transition: '.18s',
              }}>{t('deleteBtn')}</button>
            </div>
          </div>
        )
      })}
    </>
  )
}

// ── NEW EVENT ─────────────────────────────────────────────
function DashNew({ t, lang, onSaved, showToast }: any) {
  const [form, setForm] = useState({
    title: '', subtitle: '', emoji: '', category: 'Beach', status: 'draft',
    description: '', date: '', time: '08:00', meeting_point: '',
    pkg_name: '', price: '', items: '',
  })
  const [saving, setSaving] = useState(false)

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title.trim()) { showToast(lang === 'ar' ? 'العنوان مطلوب' : 'Title is required'); return }
    setSaving(true)
    const priceVal = parseFloat(form.price)
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle,
      emoji: form.emoji || '◈',
      category: form.category,
      status: form.status,
      description: form.description,
      date: form.date || null,
      time: form.time || null,
      meeting_point: form.meeting_point,
      pkg_name: form.pkg_name || 'Standard',
      price: isNaN(priceVal) ? 0 : priceVal,
      items: form.items,
      color_index: Math.floor(Math.random() * 6),
      capacity: 50,
    }
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) { onSaved() }
    else { showToast(lang === 'ar' ? 'حدث خطأ' : 'Error saving event') }
  }

  const cats = lang === 'ar' ? CATEGORIES_AR : CATEGORIES_EN
  const statuses = [
    { v: 'draft',     l: t('statusDraft')     },
    { v: 'voting',    l: t('statusVoting')    },
    { v: 'published', l: t('statusPublished') },
    { v: 'closed',    l: t('statusClosed')    },
  ]

  return (
    <>
      <DashHead title={t('newEvTitle')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        <div>
          <FormPanel title={t('basicInfo')}>
            <FRow label={`${t('evTitle')} *`}><input className="safar-input" placeholder={t('evTitlePh')} value={form.title} onChange={e => upd('title', e.target.value)} /></FRow>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <FRow label={t('evSub')}><input className="safar-input" placeholder={t('evSubPh')} value={form.subtitle} onChange={e => upd('subtitle', e.target.value)} /></FRow>
              <FRow label={t('evEmoji')}><input className="safar-input" placeholder={t('evEmojiPh')} maxLength={4} value={form.emoji} onChange={e => upd('emoji', e.target.value)} /></FRow>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <FRow label={t('evCat')}>
                <select className="safar-input fselect" value={form.category} onChange={e => upd('category', e.target.value)}>
                  {CATEGORIES_EN.map((c, i) => <option key={c} value={c}>{cats[i]}</option>)}
                </select>
              </FRow>
              <FRow label={t('evStatus')}>
                <select className="safar-input fselect" value={form.status} onChange={e => upd('status', e.target.value)}>
                  {statuses.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
              </FRow>
            </div>
            <div style={{ marginTop: 12 }}>
              <FRow label={t('evDesc')}><textarea className="safar-input" placeholder={t('evDescPh')} value={form.description} onChange={e => upd('description', e.target.value)} style={{ resize: 'vertical', minHeight: 80 }} /></FRow>
            </div>
          </FormPanel>

          <FormPanel title={t('tripInfo')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FRow label={t('evDate')}><input className="safar-input" type="date" value={form.date} onChange={e => upd('date', e.target.value)} /></FRow>
              <FRow label={t('evTime')}><input className="safar-input" type="time" value={form.time} onChange={e => upd('time', e.target.value)} /></FRow>
            </div>
            <div style={{ marginTop: 12 }}>
              <FRow label={t('meetPt')}><input className="safar-input" placeholder={t('meetPtPh')} value={form.meeting_point} onChange={e => upd('meeting_point', e.target.value)} /></FRow>
            </div>
          </FormPanel>

          <FormPanel title={t('pricingInfo')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FRow label={t('pkgName')}><input className="safar-input" placeholder={t('pkgNamePh')} value={form.pkg_name} onChange={e => upd('pkg_name', e.target.value)} /></FRow>
              <FRow label={t('pkgPrice')}><input className="safar-input" type="number" min="0" placeholder={t('pkgPricePh')} value={form.price} onChange={e => upd('price', e.target.value)} /></FRow>
            </div>
            <div style={{ marginTop: 12 }}>
              <FRow label={t('pkgItems')}><input className="safar-input" placeholder={t('pkgItemsPh')} value={form.items} onChange={e => upd('items', e.target.value)} /></FRow>
            </div>
          </FormPanel>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBottom: 32 }}>
            <button style={{ background: 'transparent', border: '1px solid var(--rim)', color: 'var(--mist)', padding: '10px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
              {t('cancel')}
            </button>
            <button onClick={save} disabled={saving} className="btn-gold" style={{ padding: '10px 24px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              {saving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('saveEv')}
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, textAlign: 'center' }}>
            {t('livePreview')}
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{
              height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 56, background: EVENT_COLORS[0].bg,
            }}>{form.emoji || '◈'}</div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--snow)', marginBottom: 4 }}>
                {form.title || (lang === 'ar' ? 'عنوان الفعالية' : 'Event Title')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fog)', marginBottom: 12 }}>
                {form.subtitle || (lang === 'ar' ? 'العنوان الفرعي' : 'Subtitle')}
              </div>
              <div style={{ background: 'var(--ink3)', border: '1px solid var(--rim)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--snow)', marginBottom: 3 }}>
                  {form.pkg_name || (lang === 'ar' ? 'الباقة' : 'Package')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fog)' }}>{form.items || '—'}</div>
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 700, color: 'var(--gold)', marginTop: 10 }}>
                {form.price === '' ? '—' : parseFloat(form.price) === 0 ? t('free') : `$${form.price}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── PARTICIPANTS ──────────────────────────────────────────
function DashParticipants({ regs, events, t, lang, onExport }: any) {
  if (!regs.length) return (
    <>
      <DashHead title={t('participants')} />
      <EmptyState icon="◎" title={t('noRegTitle')} desc={t('noRegDesc')} />
    </>
  )
  return (
    <>
      <DashHead title={t('participants')} sub={`${regs.length} ${lang === 'ar' ? 'مشارك' : 'registrations'}`}
        action={{ label: `⬇ ${t('exportCsv')}`, fn: onExport, ghost: true }} />
      <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['colName','colPhone','colEvent','colPkg','colDate','colTime'].map(k => (
                <th key={k} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'left', borderBottom: '1px solid var(--rim)', whiteSpace: 'nowrap' }}>
                  {t(k as any)}
                </th>
              ))}</tr>
            </thead>
            <tbody>
              {regs.map((r: Registration) => {
                const ev = events.find((e: Event) => e.id === r.event_id) as Event | undefined
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(44,44,68,.6)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--mist)' }}>{r.phone}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--mist)' }}>{ev?.title ?? '—'}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13 }}>
                      <span style={{ background: 'rgba(46,196,182,.12)', color: 'var(--teal)', border: '1px solid rgba(46,196,182,.22)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {r.package_name ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--fog)' }}>{r.chosen_date ?? '—'}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--fog)' }}>{r.chosen_time ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── ANALYTICS ─────────────────────────────────────────────
function DashAnalytics({ events, regs, t, lang }: any) {
  if (!regs.length) return (
    <>
      <DashHead title={t('anTitle')} />
      <EmptyState icon="◬" title={t('anTitle')} desc={t('anEmpty')} />
    </>
  )
  const em: Record<string, number> = {}
  regs.forEach((r: Registration) => { em[r.event_id] = (em[r.event_id] || 0) + 1 })
  const sorted = Object.entries(em).sort((a, b) => b[1] - a[1])
  const top = sorted.length ? (events.find((e: Event) => e.id === sorted[0][0]) as Event | undefined)?.title ?? '—' : '—'
  const pub = events.filter((e: Event) => e.status === 'published').length
  return (
    <>
      <DashHead title={t('anTitle')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { lbl: t('totalRegs'), val: regs.length, color: 'var(--snow)' },
          { lbl: t('activeEvents'), val: pub, color: 'var(--sage)' },
          { lbl: t('mostBooked'), val: top, color: 'var(--gold)', sm: true },
        ].map(({ lbl, val, color, sm }) => (
          <div key={lbl} style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fog)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>{lbl}</div>
            <div style={{ fontFamily: sm ? 'inherit' : 'Cormorant Garamond,serif', fontSize: sm ? 14 : 30, fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--snow)', marginBottom: 3 }}>{t('regsByEvent')}</div>
        <div style={{ fontSize: 11, color: 'var(--fog)', marginBottom: 20 }}>{t('countPerEvent')}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
          {sorted.map(([id, cnt]) => {
            const ev = events.find((e: Event) => e.id === id) as Event | undefined
            const max = sorted[0][1]
            return (
              <div key={id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }} title={`${ev?.title ?? id}: ${cnt}`}>
                <div style={{
                  height: Math.round(cnt / max * 80),
                  borderRadius: '4px 4px 0 0', width: '100%',
                  background: 'linear-gradient(to top,var(--gold2),var(--gold))',
                }} />
                <div style={{ fontSize: 10, color: 'var(--fog)' }}>{ev?.emoji ?? '◈'}</div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── POLLS ─────────────────────────────────────────────────
function DashPolls({ pollVotes, t, lang }: any) {
  const counts: Record<number, number> = {}
  pollVotes.forEach((v: PollVote) => { counts[v.option_index] = (counts[v.option_index] || 0) + 1 })
  const total = Object.values(counts).reduce((a: number, b: number) => a + b, 0)
  return (
    <>
      <DashHead title={t('pollsTitle')} sub={`${total} ${t('totalVotes')}`} />
      <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--snow)', marginBottom: 24 }}>{t('pollQ')}</div>
        {POLL_OPTIONS.map(opt => {
          const cnt = counts[opt.index] || 0
          const pct = total > 0 ? Math.round(cnt / total * 100) : 0
          return (
            <div key={opt.index} style={{
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 16px', borderRadius: 10,
              border: '1px solid rgba(232,184,75,.4)', background: 'rgba(232,184,75,.05)',
              marginBottom: 10,
            }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'rgba(232,184,75,.06)', pointerEvents: 'none' }} />
              <span style={{ fontSize: 22, position: 'relative', zIndex: 1 }}>{opt.emoji}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--snow)', position: 'relative', zIndex: 1 }}>{lang === 'ar' ? opt.label_ar : opt.label_en}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', position: 'relative', zIndex: 1 }}>
                {cnt} {lang === 'ar' ? 'صوت' : 'votes'} ({pct}%)
              </span>
            </div>
          )
        })}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--rim)' }}>
          <span style={{ fontSize: 12, color: 'var(--fog)' }}>{total} {t('totalVotes')}</span>
          <button className="btn-gold" style={{ padding: '8px 18px', borderRadius: 7, fontSize: 12, border: 'none', cursor: 'pointer' }}>
            {lang === 'ar' ? 'تحويل إلى فعالية →' : 'Convert to Event →'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── HELPERS ───────────────────────────────────────────────
function DashHead({ title, sub, action }: { title: string; sub?: string; action?: { label: string; fn: () => void; ghost?: boolean } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 700, color: 'var(--snow)' }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: 'var(--fog)', marginTop: 3 }}>{sub}</div>}
      </div>
      {action && (
        <button onClick={action.fn} className={action.ghost ? '' : 'btn-gold'} style={{
          padding: '10px 20px', borderRadius: 8, fontSize: 13, border: action.ghost ? '1px solid var(--rim)' : 'none',
          background: action.ghost ? 'transparent' : undefined, color: action.ghost ? 'var(--mist)' : undefined,
          cursor: 'pointer', transition: '.18s',
        }}>{action.label}</button>
      )}
    </div>
  )
}

function EmptyState({ icon, title, desc, cta, onCta }: { icon: string; title: string; desc: string; cta?: string; onCta?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, opacity: .25, marginBottom: 20 }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--mist)', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{desc}</div>
      {cta && <button onClick={onCta} className="btn-gold" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer' }}>{cta}</button>}
    </div>
  )
}

function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid var(--rim)' }}>{title}</div>
      {children}
    </div>
  )
}

function FRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</label>
      {children}
    </div>
  )
}
