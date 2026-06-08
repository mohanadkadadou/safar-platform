'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── TYPES ─────────────────────────────────────────────────
type Lang = 'en' | 'ar'
type View = 'home' | 'event' | 'register' | 'done'
type DashSection = 'overview' | 'events' | 'new' | 'participants' | 'analytics' | 'polls'

interface Event {
  id: string; title: string; subtitle?: string; description?: string
  emoji: string; category: string; status: string
  date?: string; time?: string; meeting_point?: string
  pkg_name: string; price: number; items?: string
  color_index: number; capacity: number; created_at: string
}
interface Registration {
  id: string; event_id: string; name: string; phone: string; notes?: string
  package_name?: string; chosen_date?: string; chosen_time?: string
  ref_code: string; status: string; created_at: string
}

// ── CONSTANTS ─────────────────────────────────────────────
const EV_COLORS = [
  { bg: 'linear-gradient(135deg,#062d4a,#0a4a6e)', th: 'rgba(14,165,233,.18)' },
  { bg: 'linear-gradient(135deg,#2d1a04,#4a2c08)', th: 'rgba(232,184,75,.18)' },
  { bg: 'linear-gradient(135deg,#051a0c,#0a2e18)', th: 'rgba(74,222,128,.18)' },
  { bg: 'linear-gradient(135deg,#0f0b2a,#1a1245)', th: 'rgba(155,140,247,.18)' },
  { bg: 'linear-gradient(135deg,#2d0a0a,#4a0f0f)', th: 'rgba(255,107,107,.18)' },
  { bg: 'linear-gradient(135deg,#0a2a2a,#0f4040)', th: 'rgba(46,196,182,.18)' },
]
const INV_BG = [
  'linear-gradient(160deg,#06243c,#0a3d60)', 'linear-gradient(160deg,#2d1200,#4a2000)',
  'linear-gradient(160deg,#041a0a,#072c12)', 'linear-gradient(160deg,#0c0824,#160f3e)',
  'linear-gradient(160deg,#2a0808,#420f0f)', 'linear-gradient(160deg,#041e1e,#073232)',
]
const POLL_OPTS = [
  { e: '🇹🇷', en: 'Antalya Beach Trip', ar: 'رحلة شاطئ أنطاليا' },
  { e: '🎈', en: 'Cappadocia Adventure', ar: 'مغامرة كابادوكيا' },
  { e: '🌿', en: 'Sapanca Nature Tour', ar: 'جولة طبيعة سابانجا' },
  { e: '🇦🇪', en: 'Dubai Weekend', ar: 'عطلة دبي' },
  { e: '⛵', en: 'Bosphorus Cruise', ar: 'رحلة البوسفور' },
]
const FEATURES = [
  { i: '🗓️', bg: 'rgba(46,196,182,.1)', en: 'Multi-date Scheduling', ar: 'جدولة متعددة التواريخ' },
  { i: '🗳️', bg: 'rgba(232,184,75,.1)', en: 'Voting System', ar: 'نظام التصويت' },
  { i: '🎨', bg: 'rgba(155,140,247,.1)', en: 'Event Themes', ar: 'ثيمات الفعاليات' },
  { i: '📩', bg: 'rgba(255,107,107,.1)', en: 'Invitation Cards', ar: 'بطاقات الدعوة' },
  { i: '📊', bg: 'rgba(123,198,126,.1)', en: 'Real-time Analytics', ar: 'تحليلات فورية' },
  { i: '🌐', bg: 'rgba(46,196,182,.1)', en: 'Bilingual AR/EN', ar: 'ثنائي اللغة' },
  { i: '📱', bg: 'rgba(232,184,75,.1)', en: 'Mobile First', ar: 'محسّن للجوال' },
  { i: '🔐', bg: 'rgba(155,140,247,.1)', en: 'Protected Admin', ar: 'داش بورد محمي' },
]
const CATS_EN = ['Beach','Adventure','Desert','Luxury','Mountains','City','Workshop','Concert']
const CATS_AR = ['شاطئ','مغامرة','صحراء','رفاهية','جبال','مدينة','ورشة','حفلة']

// ── TRANSLATIONS ──────────────────────────────────────────
const TR: Record<string, Record<string, string>> = {
  en: {
    brand:'Safar', home:'Home', events:'Events', adminLogin:'Admin Login', dashboard:'Dashboard',
    heroEy:'Premium Event & Trip Platform', heroLead:'Create unforgettable group experiences.',
    heroCta1:'Explore Events', heroCta2:'Admin Login',
    s1tag:'✦ Upcoming', s1title:'Featured Events', s1lead:'Discover carefully crafted experiences.',
    s2tag:'🗳 Vote Now', s2title:'Vote for Our Next Trip', pollQ:'Which destination next?',
    pollLbl:'Total votes', pollFirst:'Be the first to vote',
    s3tag:'⚡ Why Safar', s3title:'Everything You Need',
    ctaTitle:'Ready for Your Adventure?', ctaLead:'Join thousands discovering the world together.',
    ctaBtn:'Browse Upcoming Trips',
    fc1:'Platform', fc2:'Features', fc3:'Contact', credit:'Project Manager: ',
    lt:'Admin Login', ls:'Dashboard access is restricted', ll1:'Email', ll2:'Password',
    loginBtn:'Sign In →', loginHint:'Demo: admin@safar.io / admin123', loginErr:'Incorrect password.',
    sbRole:'Platform Admin', ovTitle:'Overview', ovSub:'Welcome back, Mohanad 👋',
    noEvTitle:'No events yet', noEvDesc:'Create your first event to get started.', create:'Create Event',
    statTotal:'Total Events', statPub:'Published', statReg:'Registrations', statDraft:'Awaiting Publish',
    allEv:'All Events', createNew:'+ New Event', pubBtn:'Publish', viewBtn:'View', delBtn:'Delete',
    newEvTitle:'Create New Event', basicInfo:'Basic Information', tripInfo:'Trip Details', pkgInfo:'Pricing & Package',
    evTitle:'Event Title', evTitlePh:'e.g. Beach Trip to Antalya', evSub:'Subtitle', evSubPh:'Short tagline',
    evEmo:'Emoji', evDate:'Date', evTime:'Time', evCat:'Category', evStatus:'Status',
    meetPt:'Meeting Point', meetPh:'e.g. Taksim Square', pkgName:'Package Name', pkgPh:'Standard Package',
    pkgPrice:'Price ($)', pkgPricePh:'0 = free', pkgItems:"What's Included", pkgItemsPh:'Transportation, Breakfast',
    saveEv:'Save Event', saving:'Saving...', saved:'Event saved!', cancel:'Cancel',
    sDraft:'Draft', sVoting:'Voting', sPub:'Published', sClosed:'Closed',
    noRegTitle:'No registrations yet', noRegDesc:'Participants will appear once people register.',
    colName:'Name', colPhone:'Phone', colEvent:'Event', colPkg:'Package', colDate:'Date', colTime:'Time',
    exportCsv:'Export CSV', anTitle:'Analytics', anEmpty:'Register participants to see analytics.',
    pollsTitle:'Future Trip Polls', recentRegs:'Recent Registrations', preview:'Live Preview',
    backBtn:'← All Events', pubBookBtn:"Yes, I'm Coming!", noBtn:'Maybe not…',
    free:'Free', perPerson:'per person', notPub:'This event is not yet published.',
    regS1:'Package', regS2:'Date', regS3:'Time', regS4:'Details', regS5:'Done',
    selPkg:'Choose Package', selDate:'Pick a Date', selTime:'Pick a Time',
    yourDets:'Your Details', bookDone:'Booking Confirmed!',
    subPkg:'Select the package that suits you', subDate:'Available dates',
    subTime:'Departure times', subDets:'Enter your information',
    subDone:"You're all set! Invitation ready.",
    nameL:'Full Name', namePh:'Ahmed Al-Rashid', phoneL:'Phone', phonePh:'+90 555 000 0000',
    notesL:'Notes (optional)', notesPh:'Any special requests…',
    required:'Name and phone are required.',
    back:'← Back', next:'Next →', confirm:'Confirm Booking', backHome:'← Back to events',
    invReady:'Your Invitation Card', signOut:'Sign out',
  },
  ar: {
    brand:'سفر', home:'الرئيسية', events:'الفعاليات', adminLogin:'دخول المدير', dashboard:'لوحة التحكم',
    heroEy:'منصة فعاليات ورحلات متميزة', heroLead:'أنشئ تجارب جماعية لا تُنسى.',
    heroCta1:'استكشف الفعاليات', heroCta2:'دخول المدير',
    s1tag:'✦ قادمة', s1title:'الفعاليات المميزة', s1lead:'اكتشف تجارب مُعدّة بعناية.',
    s2tag:'🗳 صوّت الآن', s2title:'صوّت لرحلتنا القادمة', pollQ:'أي وجهة تريد القادمة؟',
    pollLbl:'إجمالي الأصوات', pollFirst:'كن أول من يصوت',
    s3tag:'⚡ لماذا سفر', s3title:'كل ما تحتاجه',
    ctaTitle:'هل أنت مستعد لمغامرتك؟', ctaLead:'انضم لآلاف المسافرين الذين يكتشفون العالم.',
    ctaBtn:'تصفح الرحلات القادمة',
    fc1:'المنصة', fc2:'المميزات', fc3:'التواصل', credit:'مدير المشروع: ',
    lt:'تسجيل دخول المدير', ls:'الوصول للوحة التحكم محمي', ll1:'البريد الإلكتروني', ll2:'كلمة المرور',
    loginBtn:'دخول ←', loginHint:'تجريبي: admin@safar.io / admin123', loginErr:'كلمة مرور خاطئة.',
    sbRole:'مدير المنصة', ovTitle:'نظرة عامة', ovSub:'أهلاً بك، مهند 👋',
    noEvTitle:'لا توجد فعاليات بعد', noEvDesc:'أنشئ فعاليتك الأولى للبدء.', create:'إنشاء فعالية',
    statTotal:'إجمالي الفعاليات', statPub:'منشورة', statReg:'التسجيلات', statDraft:'تنتظر النشر',
    allEv:'جميع الفعاليات', createNew:'+ فعالية جديدة', pubBtn:'نشر', viewBtn:'عرض', delBtn:'حذف',
    newEvTitle:'إنشاء فعالية جديدة', basicInfo:'المعلومات الأساسية', tripInfo:'تفاصيل الرحلة', pkgInfo:'السعر والباقة',
    evTitle:'عنوان الفعالية', evTitlePh:'مثال: رحلة شاطئ أنطاليا', evSub:'العنوان الفرعي', evSubPh:'وصف مختصر',
    evEmo:'رمز', evDate:'التاريخ', evTime:'الوقت', evCat:'الفئة', evStatus:'الحالة',
    meetPt:'نقطة التجمع', meetPh:'مثال: ميدان تقسيم', pkgName:'اسم الباقة', pkgPh:'الباقة المعيارية',
    pkgPrice:'السعر ($)', pkgPricePh:'0 = مجاناً', pkgItems:'ما يشمله', pkgItemsPh:'مواصلات، إفطار',
    saveEv:'حفظ الفعالية', saving:'جاري الحفظ...', saved:'تم الحفظ!', cancel:'إلغاء',
    sDraft:'مسودة', sVoting:'تصويت', sPub:'منشورة', sClosed:'مغلقة',
    noRegTitle:'لا توجد تسجيلات بعد', noRegDesc:'ستظهر التسجيلات هنا بعد تسجيل المشاركين.',
    colName:'الاسم', colPhone:'الهاتف', colEvent:'الفعالية', colPkg:'الباقة', colDate:'التاريخ', colTime:'الوقت',
    exportCsv:'تصدير CSV', anTitle:'التحليلات', anEmpty:'سجّل مشاركين أولاً.',
    pollsTitle:'استطلاعات الرحلات', recentRegs:'آخر التسجيلات', preview:'معاينة مباشرة',
    backBtn:'← جميع الفعاليات', pubBookBtn:'نعم، سأحضر!', noBtn:'ربما لا...',
    free:'مجاناً', perPerson:'لكل شخص', notPub:'هذه الفعالية غير منشورة بعد.',
    regS1:'الباقة', regS2:'التاريخ', regS3:'الوقت', regS4:'البيانات', regS5:'تأكيد',
    selPkg:'اختر الباقة', selDate:'اختر التاريخ', selTime:'اختر الوقت',
    yourDets:'بياناتك', bookDone:'تم تأكيد الحجز!',
    subPkg:'اختر الباقة المناسبة', subDate:'التواريخ المتاحة',
    subTime:'أوقات الانطلاق', subDets:'أدخل بياناتك',
    subDone:'تم كل شيء! بطاقة دعوتك جاهزة.',
    nameL:'الاسم الكامل', namePh:'أحمد الراشد', phoneL:'رقم الهاتف', phonePh:'+966 5X XXX XXXX',
    notesL:'ملاحظات (اختياري)', notesPh:'أي طلبات خاصة...',
    required:'الاسم والهاتف مطلوبان.',
    back:'→ رجوع', next:'التالي ←', confirm:'تأكيد الحجز', backHome:'← العودة للفعاليات',
    invReady:'بطاقة دعوتك', signOut:'تسجيل الخروج',
  }
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDash, setShowDash] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [view, setView] = useState<View>('home')
  const [selEvent, setSelEvent] = useState<Event | null>(null)
  const [toastMsg, setToastMsg] = useState('')

  const t = useCallback((k: string) => TR[lang][k] || TR.en[k] || k, [lang])
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }, [lang, dir])

  const toast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const openEvent = (ev: Event) => { setSelEvent(ev); setView('event'); window.scrollTo(0,0) }
  const openReg = (ev: Event) => { setSelEvent(ev); setView('register'); window.scrollTo(0,0) }
  const goHome = () => { setView('home'); setSelEvent(null); window.scrollTo(0,0) }
  const goEvents = () => {
    setView('home'); setSelEvent(null)
    setTimeout(() => document.getElementById('ev-sec')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  if (isAdmin && showDash) return (
    <>
      <Navbar lang={lang} t={t} onHome={() => { setShowDash(false); goHome() }} onEvents={() => { setShowDash(false); goEvents() }}
        onAuth={() => {}} isAdmin={true} onDash={() => setShowDash(true)} onLang={() => setLang(l => l==='en'?'ar':'en')} />
      <AdminDash t={t} lang={lang} toast={toast} onViewEvent={openEvent} onLogout={() => { setIsAdmin(false); setShowDash(false); goHome() }} />
      {toastMsg && <Toast msg={toastMsg} />}
    </>
  )

  return (
    <>
      <Navbar lang={lang} t={t} onHome={goHome} onEvents={goEvents}
        onAuth={() => setShowLogin(true)} isAdmin={isAdmin} onDash={() => setShowDash(true)}
        onLang={() => setLang(l => l==='en'?'ar':'en')} />

      {view === 'home' && <>
        <Hero t={t} lang={lang} onExplore={goEvents} onAdmin={() => setShowLogin(true)} />
        <EventsGrid t={t} lang={lang} onEventClick={openEvent} />
        <PollSection t={t} lang={lang} />
        <FeaturesSection t={t} lang={lang} />
        <CTASection t={t} onExplore={goEvents} />
        <Footer t={t} lang={lang} onHome={goHome} onEvents={goEvents} onAdmin={() => setShowLogin(true)} />
      </>}

      {view === 'event' && selEvent && <EventPage ev={selEvent} t={t} lang={lang} onBack={goEvents} onRegister={openReg} />}
      {view === 'register' && selEvent && <RegFlow ev={selEvent} t={t} lang={lang} onBack={() => setView('event')} onDone={() => { toast('🎉 ' + t('bookDone')); goHome() }} />}

      {showLogin && <LoginModal t={t} lang={lang} onClose={() => setShowLogin(false)} onSuccess={() => { setIsAdmin(true); setShowLogin(false); setShowDash(true) }} />}
      {toastMsg && <Toast msg={toastMsg} />}
    </>
  )
}

// ── NAVBAR ────────────────────────────────────────────────
function Navbar({ lang, t, onHome, onEvents, onAuth, isAdmin, onDash, onLang }: any) {
  return (
    <nav style={{ position:'sticky', top:0, zIndex:200, height:62, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', background:'rgba(8,8,14,.92)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(232,184,75,.1)' }}>
      <div onClick={onHome} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
        <div style={{ width:34, height:34, borderRadius:8, background:'linear-gradient(135deg,#e8b84b,#c99a2e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#08080e', fontWeight:800 }}>✦</div>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:'var(--snow)' }}>{t('brand')}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:2 }}>
        {[{l:t('home'),f:onHome},{l:t('events'),f:onEvents}].map(({l,f})=>(
          <button key={l} onClick={f} style={{ padding:'7px 16px', borderRadius:7, fontSize:13, fontWeight:500, color:'var(--mist)', background:'none', border:'none', cursor:'pointer' }}>{l}</button>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onLang} style={{ padding:'5px 12px', borderRadius:20, background:'rgba(232,184,75,.08)', border:'1px solid rgba(232,184,75,.2)', color:'var(--gold)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          {lang==='en'?'ع':'EN'}
        </button>
        <button onClick={isAdmin ? onDash : onAuth} className="btn-gold" style={{ padding:'9px 20px', borderRadius:8, fontSize:13 }}>
          {isAdmin ? t('dashboard') : t('adminLogin')}
        </button>
      </div>
    </nav>
  )
}

// ── HERO ──────────────────────────────────────────────────
function Hero({ t, lang, onExplore, onAdmin }: any) {
  return (
    <section style={{ minHeight:'94vh', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 24px 80px', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 50% at 50% 20%,rgba(232,184,75,.09) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 15% 80%,rgba(46,196,182,.06) 0%,transparent 60%)' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'52px 52px' }} />
      <div style={{ display:'inline-flex', alignItems:'center', gap:9, border:'1px solid rgba(232,184,75,.25)', background:'rgba(232,184,75,.06)', borderRadius:50, padding:'7px 18px', fontSize:11, fontWeight:600, color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:36 }}>
        <div style={{ width:6, height:6, background:'var(--gold)', borderRadius:'50%', animation:'pulse 2.5s infinite' }} />
        {t('heroEy')}
      </div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(52px,7vw,88px)', fontWeight:700, lineHeight:1.0, color:'var(--snow)', maxWidth:900, letterSpacing:'-.01em', marginBottom:0 }}>
        {lang==='en' ? <>{lang==='en'?'Your Journey':''}<br /><em style={{ fontStyle:'italic', color:'var(--gold)' }}>Begins Here</em></> : <>{t('brand')}<br /><em style={{ fontStyle:'italic', color:'var(--gold)' }}>يبدأ هنا</em></>}
      </h1>
      <p style={{ fontSize:17, color:'var(--mist)', maxWidth:520, margin:'28px auto 44px', lineHeight:1.75 }}>{t('heroLead')}</p>
      <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
        <button onClick={onExplore} className="btn-gold" style={{ padding:'16px 32px', borderRadius:12, fontSize:15 }}>{t('heroCta1')}</button>
        <button onClick={onAdmin} style={{ background:'transparent', border:'1px solid var(--rim2)', color:'var(--ghost)', padding:'16px 32px', borderRadius:12, fontSize:15, cursor:'pointer' }}>{t('heroCta2')}</button>
      </div>
      <div style={{ display:'flex', gap:48, justifyContent:'center', marginTop:72, paddingTop:48, borderTop:'1px solid var(--rim)' }}>
        {[{n:'2,400+',l:'stat1'},{n:'180+',l:'stat2'},{n:'98%',l:'stat3'}].map(({n,l})=>(
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:700, color:'var(--gold)', lineHeight:1 }}>{n}</div>
            <div style={{ fontSize:12, color:'var(--fog)', marginTop:4, letterSpacing:'.04em', textTransform:'uppercase' }}>{t(l)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── EVENTS GRID ───────────────────────────────────────────
function EventsGrid({ t, lang, onEventClick }: any) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('events').select('*').eq('status','published').order('date',{ascending:true})
      .then(({ data }) => { setEvents(data||[]); setLoading(false) })
    const sub = supabase.channel('pub-events')
      .on('postgres_changes',{event:'*',schema:'public',table:'events'},()=>{
        supabase.from('events').select('*').eq('status','published').then(({data})=>setEvents(data||[]))
      }).subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  return (
    <div id="ev-sec" style={{ padding:'88px 32px', maxWidth:1140, margin:'0 auto' }}>
      <SectionTag>{t('s1tag')}</SectionTag>
      <SectionTitle lang={lang}>{t('s1title')}</SectionTitle>
      <p style={{ fontSize:15, color:'var(--mist)', lineHeight:1.8, marginBottom:44 }}>{t('s1lead')}</p>
      {loading ? <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="loader"/></div>
      : events.length===0 ? (
        <div style={{textAlign:'center',padding:'60px 20px',opacity:.5}}>
          <div style={{fontSize:40,marginBottom:16}}>◈</div>
          <div style={{fontSize:16,color:'var(--mist)'}}>{lang==='ar'?'لا توجد فعاليات منشورة':'No published events yet'}</div>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:20}}>
          {events.map(ev=>{
            const cl=EV_COLORS[ev.color_index%EV_COLORS.length]
            const pr=ev.price>0?`$${ev.price}`:ev.price===0?t('free'):''
            return (
              <div key={ev.id} onClick={()=>onEventClick(ev)} style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:24,overflow:'hidden',cursor:'pointer',transition:'.25s'}}
                onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='rgba(232,184,75,.4)';el.style.transform='translateY(-5px)';el.style.boxShadow='0 20px 48px rgba(0,0,0,.5)'}}
                onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--rim)';el.style.transform='none';el.style.boxShadow='none'}}
              >
                <div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',background:cl.bg,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(255,255,255,.06),transparent 70%)'}}/>
                  <div className="animate-float" style={{fontSize:64}}>{ev.emoji}</div>
                  <span style={{position:'absolute',top:14,left:14,padding:'4px 10px',borderRadius:6,fontSize:10,fontWeight:600,background:'rgba(8,8,14,.7)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.08)',color:'var(--ghost)'}}>{ev.category}</span>
                  <span style={{position:'absolute',top:14,right:14,padding:'4px 11px',borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',background:'rgba(123,198,126,.15)',color:'var(--sage)',border:'1px solid rgba(123,198,126,.25)'}}>{lang==='ar'?'منشورة':'Open'}</span>
                </div>
                <div style={{padding:18}}>
                  <div style={{fontSize:16,fontWeight:600,color:'var(--snow)',marginBottom:5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.title}</div>
                  <div style={{fontSize:12,color:'var(--fog)'}}>{ev.subtitle}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px',borderTop:'1px solid var(--rim)'}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:'var(--gold)'}}>{pr}</span>
                  <span style={{fontSize:11,color:'var(--fog)'}}>{ev.date?`📅 ${ev.date}`:''}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── POLL ──────────────────────────────────────────────────
function PollSection({ t, lang }: any) {
  const [votes, setVotes] = useState<Record<number,number>>({})
  const [myVote, setMyVote] = useState<number|null>(null)
  const total = Object.values(votes).reduce((a,b)=>a+b,0)

  useEffect(()=>{
    supabase.from('poll_votes').select('option_index').then(({data})=>{
      const c:Record<number,number>={}; data?.forEach(v=>{c[v.option_index]=(c[v.option_index]||0)+1}); setVotes(c)
    })
    const saved=localStorage.getItem('safar_vote'); if(saved) setMyVote(Number(saved))
    const sub=supabase.channel('poll-rt').on('postgres_changes',{event:'INSERT',schema:'public',table:'poll_votes'},(p:any)=>{
      const i=p.new.option_index; setVotes(prev=>({...prev,[i]:(prev[i]||0)+1}))
    }).subscribe()
    return ()=>{supabase.removeChannel(sub)}
  },[])

  const vote=async(i:number)=>{
    if(myVote!==null)return; setMyVote(i); setVotes(prev=>({...prev,[i]:(prev[i]||0)+1}))
    localStorage.setItem('safar_vote',String(i)); await supabase.from('poll_votes').insert({option_index:i})
  }

  return (
    <div style={{background:'var(--ink2)',borderTop:'1px solid var(--rim)',borderBottom:'1px solid var(--rim)'}}>
      <div style={{maxWidth:1140,margin:'0 auto',padding:'88px 32px',display:'grid',gridTemplateColumns:'1fr 1.1fr',gap:64,alignItems:'center'}}>
        <div>
          <SectionTag>{t('s2tag')}</SectionTag>
          <SectionTitle lang={lang}>{t('s2title')}</SectionTitle>
          <div style={{marginTop:28}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:'var(--gold)',lineHeight:1}}>{total}</div>
            <div style={{fontSize:12,color:'var(--fog)',marginTop:4,letterSpacing:'.04em',textTransform:'uppercase'}}>{t('pollLbl')}</div>
          </div>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:24,padding:32}}>
          <div style={{fontSize:16,fontWeight:600,color:'var(--snow)',marginBottom:24}}>{t('pollQ')}</div>
          {POLL_OPTS.map((p,i)=>{
            const pct=total>0?Math.round((votes[i]||0)/total*100):0
            return (
              <div key={i} onClick={()=>vote(i)} style={{position:'relative',overflow:'hidden',display:'flex',alignItems:'center',gap:14,padding:'13px 16px',borderRadius:10,border:`1px solid ${myVote===i?'rgba(232,184,75,.4)':'var(--rim)'}`,background:myVote===i?'rgba(232,184,75,.05)':'var(--ink3)',cursor:myVote!==null?'default':'pointer',transition:'.18s',marginBottom:10}}>
                <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:'rgba(232,184,75,.06)',transition:'width .8s',pointerEvents:'none'}}/>
                <span style={{fontSize:22,position:'relative',zIndex:1}}>{p.e}</span>
                <span style={{flex:1,fontSize:13,color:'var(--snow)',position:'relative',zIndex:1}}>{lang==='ar'?p.ar:p.en}</span>
                <span style={{fontSize:13,fontWeight:600,color:'var(--gold)',position:'relative',zIndex:1}}>{total>0?`${pct}%`:''}</span>
              </div>
            )
          })}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:18,paddingTop:18,borderTop:'1px solid var(--rim)'}}>
            <span style={{fontSize:12,color:'var(--fog)'}}>{total>0?`${total} ${lang==='ar'?'صوت':'votes'}`:t('pollFirst')}</span>
            <button className="btn-gold" style={{padding:'8px 18px',borderRadius:7,fontSize:12}}>{lang==='ar'?'تحويل إلى فعالية →':'Convert to Event →'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── FEATURES ──────────────────────────────────────────────
function FeaturesSection({ t, lang }: any) {
  return (
    <div style={{padding:'88px 32px',maxWidth:1140,margin:'0 auto'}}>
      <SectionTag>{t('s3tag')}</SectionTag>
      <SectionTitle lang={lang}>{t('s3title')}</SectionTitle>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16,marginTop:44}}>
        {FEATURES.map((f,i)=>(
          <div key={i} style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:28,transition:'.22s'}}
            onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='rgba(232,184,75,.25)';el.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--rim)';el.style.transform='none'}}
          >
            <div style={{width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:18,background:f.bg}}>{f.i}</div>
            <div style={{fontSize:15,fontWeight:600,color:'var(--snow)',marginBottom:8}}>{lang==='ar'?f.ar:f.en}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── CTA + FOOTER ──────────────────────────────────────────
function CTASection({ t, onExplore }: any) {
  return (
    <div style={{padding:'100px 32px',textAlign:'center',background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(232,184,75,.07) 0%,transparent 70%)',borderTop:'1px solid var(--rim)'}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(36px,5vw,60px)',fontWeight:700,color:'var(--snow)',marginBottom:14,lineHeight:1.05}}>
        {t('ctaTitle')}
      </h2>
      <p style={{fontSize:16,color:'var(--mist)',marginBottom:36}}>{t('ctaLead')}</p>
      <button onClick={onExplore} className="btn-gold" style={{padding:'16px 32px',borderRadius:12,fontSize:15}}>{t('ctaBtn')}</button>
    </div>
  )
}

function Footer({ t, lang, onHome, onEvents, onAdmin }: any) {
  const lk = (label: string, fn: ()=>void) => (
    <span key={label} onClick={fn} style={{display:'block',fontSize:13,color:'var(--fog)',padding:'4px 0',cursor:'pointer'}}>{label}</span>
  )
  return (
    <footer style={{background:'var(--ink2)',borderTop:'1px solid var(--rim)',padding:'56px 32px 32px'}}>
      <div style={{maxWidth:1140,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:48,marginBottom:40}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:8,background:'linear-gradient(135deg,#e8b84b,#c99a2e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#08080e',fontWeight:800}}>✦</div>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:'var(--snow)'}}>{t('brand')}</span>
            </div>
            <p style={{fontSize:13,color:'var(--fog)',lineHeight:1.75}}>Premium event and trip management platform.</p>
          </div>
          <div><div style={{fontSize:12,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:16}}>{t('fc1')}</div>{lk(t('home'),onHome)}{lk(t('events'),onEvents)}{lk(t('adminLogin'),onAdmin)}</div>
          <div><div style={{fontSize:12,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:16}}>{t('fc2')}</div>{lk('Voting System',()=>{})}{lk('QR Codes',()=>{})}{lk('Analytics',()=>{})}</div>
          <div><div style={{fontSize:12,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:16}}>{t('fc3')}</div>{lk('hello@safar.io',()=>{})}{lk('@safar',()=>{})}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:28,borderTop:'1px solid var(--rim)',fontSize:12,color:'var(--fog)'}}>
          <span>© 2025 Safar. All rights reserved.</span>
          <span>{t('credit')}<span style={{color:'var(--gold)'}}>Mohanad Kadadou</span></span>
        </div>
      </div>
    </footer>
  )
}

// ── LOGIN MODAL ───────────────────────────────────────────
function LoginModal({ t, lang, onClose, onSuccess }: any) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    const res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:pw}) })
    setLoading(false)
    if (res.ok) { onSuccess() } else { setErr(true) }
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(8,8,14,.85)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:20,padding:'40px 36px',width:'100%',maxWidth:400}}>
        <div style={{width:54,height:54,borderRadius:14,background:'linear-gradient(135deg,#e8b84b,#c99a2e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,color:'#08080e',fontWeight:800,margin:'0 auto 24px'}}>✦</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:'var(--snow)',textAlign:'center',marginBottom:5}}>{t('lt')}</div>
        <div style={{fontSize:13,color:'var(--fog)',textAlign:'center',marginBottom:32}}>{t('ls')}</div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:7}}>{t('ll1')}</label>
          <input className="safar-input" type="email" defaultValue="admin@safar.io" readOnly style={{opacity:.7}} />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:7}}>{t('ll2')}</label>
          <input className="safar-input" type="password" placeholder="••••••••••" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>{if(e.key==='Enter')submit()}} style={err?{borderColor:'var(--coral)'}:{}} />
          {err && <span style={{fontSize:12,color:'var(--coral)',marginTop:4,display:'block'}}>{t('loginErr')}</span>}
        </div>
        <button onClick={submit} disabled={loading} className="btn-gold" style={{width:'100%',padding:13,borderRadius:9,fontSize:14,marginTop:6}}>
          {loading ? '...' : t('loginBtn')}
        </button>
        <div style={{fontSize:11,color:'var(--fog)',textAlign:'center',marginTop:18}}>{t('loginHint')}</div>
        <div style={{fontSize:11,color:'var(--fog)',textAlign:'center',marginTop:28,paddingTop:18,borderTop:'1px solid var(--rim)'}}>Project Manager: <span style={{color:'var(--gold)'}}>Mohanad Kadadou</span></div>
      </div>
    </div>
  )
}

// ── ADMIN DASHBOARD ───────────────────────────────────────
function AdminDash({ t, lang, toast, onViewEvent, onLogout }: any) {
  const [sec, setSec] = useState<DashSection>('overview')
  const [events, setEvents] = useState<Event[]>([])
  const [regs, setRegs] = useState<Registration[]>([])
  const [pollVotes, setPollVotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [evRes, regRes, pvRes] = await Promise.all([
      supabase.from('events').select('*').order('created_at',{ascending:false}),
      supabase.from('registrations').select('*').order('created_at',{ascending:false}),
      supabase.from('poll_votes').select('*'),
    ])
    setEvents(evRes.data||[]); setRegs(regRes.data||[]); setPollVotes(pvRes.data||[])
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  const publishEv = async (id: string) => {
    await fetch('/api/events',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status:'published'})})
    toast(lang==='ar'?'✓ تم النشر':'✓ Published'); load()
  }
  const deleteEv = async (id: string) => {
    if(!confirm(lang==='ar'?'تأكيد الحذف؟':'Delete?'))return
    await fetch('/api/events',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
    toast(lang==='ar'?'تم الحذف':'Deleted'); load()
  }
  const exportCSV = () => {
    const rows=[['Name','Phone','Event','Package','Date','Time'],...regs.map(r=>{const ev=events.find(e=>e.id===r.event_id)||{} as any;return[r.name,r.phone,ev.title||'',r.package_name||'',r.chosen_date||'',r.chosen_time||'']})]
    const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='participants.csv';a.click()
  }

  const sb = (id: DashSection, ico: string, lbl: string, bdg?: number) => (
    <button key={id} onClick={()=>setSec(id)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,fontSize:13,fontWeight:500,color:sec===id?'var(--gold)':'var(--mist)',background:sec===id?'rgba(232,184,75,.1)':'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left',transition:'.15s',marginBottom:2}}>
      <span style={{fontSize:16,width:20,textAlign:'center'}}>{ico}</span>
      <span style={{flex:1}}>{lbl}</span>
      {bdg?<span style={{background:'var(--coral)',color:'#fff',fontSize:10,padding:'1px 6px',borderRadius:10}}>{bdg}</span>:null}
    </button>
  )

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 62px)'}}>
      <aside style={{background:'var(--ink2)',borderRight:'1px solid var(--rim)',display:'flex',flexDirection:'column',position:'sticky',top:62,height:'calc(100vh - 62px)',overflowY:'auto'}}>
        <div style={{padding:'20px 16px 18px',borderBottom:'1px solid var(--rim)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:'linear-gradient(135deg,rgba(232,184,75,.3),rgba(232,184,75,.1))',border:'1px solid rgba(232,184,75,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'var(--gold)'}}>M</div>
            <div><div style={{fontSize:13,fontWeight:600,color:'var(--snow)'}}>Mohanad K.</div><div style={{fontSize:11,color:'var(--fog)'}}>{t('sbRole')}</div></div>
          </div>
        </div>
        <nav style={{padding:'12px 8px',flex:1}}>
          {sb('overview','◈',t('ovTitle'))}
          {sb('events','◫',t('allEv'),events.length||undefined)}
          {sb('new','⊕',t('newEvTitle').split(' ')[0]+' '+t('newEvTitle').split(' ')[1]||'New Event')}
          {sb('participants','◎',t('colName').includes('ا')?'المشاركون':'Participants',regs.length||undefined)}
          {sb('analytics','◬',t('anTitle'))}
          {sb('polls','◐',t('pollsTitle').split(' ')[0]||'Polls')}
        </nav>
        <div style={{padding:'12px 8px 16px',borderTop:'1px solid var(--rim)'}}>
          <button onClick={onLogout} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,fontSize:13,color:'var(--fog)',background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left'}}>
            <span>↩</span><span>{t('signOut')}</span>
          </button>
        </div>
      </aside>
      <div style={{padding:'28px 32px',overflowY:'auto'}}>
        {loading ? <div style={{display:'flex',justifyContent:'center',padding:80}}><div className="loader" style={{width:32,height:32}}/></div> : <>
          {sec==='overview' && <DashOverview events={events} regs={regs} t={t} lang={lang} onNew={()=>setSec('new')} />}
          {sec==='events' && <DashEvents events={events} regs={regs} t={t} lang={lang} onNew={()=>setSec('new')} onPub={publishEv} onDel={deleteEv} onView={onViewEvent} />}
          {sec==='new' && <DashNew t={t} lang={lang} onSaved={async()=>{await load();setSec('events');toast(t('saved'))}} toast={toast} />}
          {sec==='participants' && <DashParts regs={regs} events={events} t={t} lang={lang} onExport={exportCSV} />}
          {sec==='analytics' && <DashAnalytics events={events} regs={regs} t={t} lang={lang} />}
          {sec==='polls' && <DashPolls pollVotes={pollVotes} t={t} lang={lang} />}
        </>}
      </div>
    </div>
  )
}

function DashOverview({ events, regs, t, lang, onNew }: any) {
  if(!events.length) return <><DH title={t('ovTitle')} sub={t('ovSub')}/><Empty ico="◈" title={t('noEvTitle')} desc={t('noEvDesc')} cta={t('create')} onCta={onNew}/></>
  return <>
    <DH title={t('ovTitle')} sub={t('ovSub')} action={{l:t('createNew'),f:onNew}}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
      {[{l:t('statTotal'),v:events.length,c:'var(--snow)'},{l:t('statPub'),v:events.filter((e:Event)=>e.status==='published').length,c:'var(--sage)'},{l:t('statReg'),v:regs.length,c:'var(--violet)'},{l:t('statDraft'),v:events.filter((e:Event)=>e.status==='draft').length,c:'var(--teal)'}].map(({l,v,c})=>(
        <div key={l} style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:20}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--fog)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>{l}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:c,lineHeight:1}}>{v}</div>
        </div>
      ))}
    </div>
    {regs.length>0 && <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,overflow:'hidden',marginTop:20}}>
      <div style={{padding:'16px 20px',borderBottom:'1px solid var(--rim)',fontSize:14,fontWeight:600,color:'var(--snow)'}}>{t('recentRegs')}</div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>{['colName','colEvent','colDate'].map(k=><th key={k} style={{padding:'10px 16px',fontSize:10,fontWeight:700,color:'var(--fog)',textTransform:'uppercase',letterSpacing:'.08em',textAlign:'left',borderBottom:'1px solid var(--rim)'}}>{t(k)}</th>)}</tr></thead>
        <tbody>{regs.slice(0,5).map((r:Registration)=>{const ev=events.find((e:Event)=>e.id===r.event_id);return(<tr key={r.id}><td style={{padding:'11px 16px',fontSize:13,fontWeight:500}}>{r.name}</td><td style={{padding:'11px 16px',fontSize:13,color:'var(--mist)'}}>{ev?.title||'—'}</td><td style={{padding:'11px 16px',fontSize:13,color:'var(--fog)'}}>{r.chosen_date||'—'}</td></tr>)})}</tbody>
      </table>
    </div>}
  </>
}

function DashEvents({ events, regs, t, lang, onNew, onPub, onDel, onView }: any) {
  if(!events.length) return <><DH title={t('allEv')} action={{l:t('createNew'),f:onNew}}/><Empty ico="◫" title={t('noEvTitle')} desc={t('noEvDesc')} cta={t('create')} onCta={onNew}/></>
  const sL: Record<string,string> = {published:t('sPub'),voting:t('sVoting'),draft:t('sDraft'),closed:t('sClosed')}
  return <>
    <DH title={t('allEv')} sub={`${events.length} ${lang==='ar'?'فعالية':'events'}`} action={{l:t('createNew'),f:onNew}}/>
    {events.map((ev:Event)=>{
      const cl=EV_COLORS[ev.color_index%EV_COLORS.length]
      const rc=regs.filter((r:Registration)=>r.event_id===ev.id).length
      return <div key={ev.id} style={{display:'flex',alignItems:'center',gap:14,padding:'15px 18px',background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,marginBottom:10,transition:'.18s'}}
        onMouseEnter={e=>e.currentTarget.style.borderColor='var(--rim2)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--rim)'}>
        <div style={{width:44,height:44,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0,background:cl.th}}>{ev.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:600,color:'var(--snow)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.title}</div>
          <div style={{fontSize:12,color:'var(--fog)',marginTop:2}}>{[ev.date,ev.time,rc?`${rc} regs`:''].filter(Boolean).join(' · ')}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <span style={{padding:'4px 11px',borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',...statusStyle(ev.status)}}>{sL[ev.status]||ev.status}</span>
          {ev.status==='draft'&&<button onClick={()=>onPub(ev.id)} style={{background:'rgba(123,198,126,.12)',border:'1px solid rgba(123,198,126,.25)',color:'var(--sage)',padding:'7px 14px',borderRadius:8,fontSize:12,cursor:'pointer'}}>{t('pubBtn')}</button>}
          <button onClick={()=>onView(ev)} style={{background:'transparent',border:'1px solid var(--rim)',color:'var(--mist)',padding:'7px 14px',borderRadius:8,fontSize:12,cursor:'pointer'}}>{t('viewBtn')}</button>
          <button onClick={()=>onDel(ev.id)} style={{background:'rgba(255,107,107,.12)',border:'1px solid rgba(255,107,107,.25)',color:'var(--coral)',padding:'7px 14px',borderRadius:8,fontSize:12,cursor:'pointer'}}>{t('delBtn')}</button>
        </div>
      </div>
    })}
  </>
}

function DashNew({ t, lang, onSaved, toast }: any) {
  const [f,setF]=useState({title:'',subtitle:'',emoji:'',category:'Beach',status:'draft',description:'',date:'',time:'08:00',meeting_point:'',pkg_name:'',price:'',items:''})
  const [saving,setSaving]=useState(false)
  const u=(k:string,v:string)=>setF(p=>({...p,[k]:v}))
  const cats=lang==='ar'?CATS_AR:CATS_EN
  const sts=[{v:'draft',l:t('sDraft')},{v:'voting',l:t('sVoting')},{v:'published',l:t('sPub')},{v:'closed',l:t('sClosed')}]

  const save=async()=>{
    if(!f.title.trim()){toast(lang==='ar'?'العنوان مطلوب':'Title required');return}
    setSaving(true)
    const pv=parseFloat(f.price)
    await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:f.title.trim(),subtitle:f.subtitle,emoji:f.emoji||'◈',category:f.category,status:f.status,description:f.description,date:f.date||null,time:f.time||null,meeting_point:f.meeting_point,pkg_name:f.pkg_name||'Standard',price:isNaN(pv)?0:pv,items:f.items,color_index:Math.floor(Math.random()*6),capacity:50})})
    setSaving(false); onSaved()
  }

  return <>
    <DH title={t('newEvTitle')}/>
    <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:20,alignItems:'start'}}>
      <div>
        <FP title={t('basicInfo')}>
          <FR label={`${t('evTitle')} *`}><input className="safar-input" placeholder={t('evTitlePh')} value={f.title} onChange={e=>u('title',e.target.value)}/></FR>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
            <FR label={t('evSub')}><input className="safar-input" placeholder={t('evSubPh')} value={f.subtitle} onChange={e=>u('subtitle',e.target.value)}/></FR>
            <FR label={t('evEmo')}><input className="safar-input" placeholder="🏖️" maxLength={4} value={f.emoji} onChange={e=>u('emoji',e.target.value)}/></FR>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
            <FR label={t('evCat')}><select className="safar-input" value={f.category} onChange={e=>u('category',e.target.value)} style={{cursor:'pointer'}}>{CATS_EN.map((c,i)=><option key={c} value={c}>{cats[i]}</option>)}</select></FR>
            <FR label={t('evStatus')}><select className="safar-input" value={f.status} onChange={e=>u('status',e.target.value)} style={{cursor:'pointer'}}>{sts.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}</select></FR>
          </div>
          <div style={{marginTop:12}}><FR label={t('evTitle').replace('Event Title','Description').replace('عنوان الفعالية','التفاصيل')}><textarea className="safar-input" placeholder={t('evSubPh')} value={f.description} onChange={e=>u('description',e.target.value)} style={{resize:'vertical',minHeight:80}}/></FR></div>
        </FP>
        <FP title={t('tripInfo')}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <FR label={t('evDate')}><input className="safar-input" type="date" value={f.date} onChange={e=>u('date',e.target.value)}/></FR>
            <FR label={t('evTime')}><input className="safar-input" type="time" value={f.time} onChange={e=>u('time',e.target.value)}/></FR>
          </div>
          <div style={{marginTop:12}}><FR label={t('meetPt')}><input className="safar-input" placeholder={t('meetPh')} value={f.meeting_point} onChange={e=>u('meeting_point',e.target.value)}/></FR></div>
        </FP>
        <FP title={t('pkgInfo')}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <FR label={t('pkgName')}><input className="safar-input" placeholder={t('pkgPh')} value={f.pkg_name} onChange={e=>u('pkg_name',e.target.value)}/></FR>
            <FR label={t('pkgPrice')}><input className="safar-input" type="number" min="0" placeholder={t('pkgPricePh')} value={f.price} onChange={e=>u('price',e.target.value)}/></FR>
          </div>
          <div style={{marginTop:12}}><FR label={t('pkgItems')}><input className="safar-input" placeholder={t('pkgItemsPh')} value={f.items} onChange={e=>u('items',e.target.value)}/></FR></div>
        </FP>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginBottom:32}}>
          <button style={{background:'transparent',border:'1px solid var(--rim)',color:'var(--mist)',padding:'10px 20px',borderRadius:8,fontSize:13,cursor:'pointer'}}>{t('cancel')}</button>
          <button onClick={save} disabled={saving} className="btn-gold" style={{padding:'10px 24px',borderRadius:8,fontSize:13}}>{saving?t('saving'):t('saveEv')}</button>
        </div>
      </div>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:'var(--fog)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12,textAlign:'center'}}>{t('preview')}</div>
        <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,overflow:'hidden'}}>
          <div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,background:EV_COLORS[0].bg}}>{f.emoji||'◈'}</div>
          <div style={{padding:18}}>
            <div style={{fontSize:16,fontWeight:600,color:'var(--snow)',marginBottom:4}}>{f.title||t('evTitlePh')}</div>
            <div style={{fontSize:12,color:'var(--fog)',marginBottom:12}}>{f.subtitle||t('evSubPh')}</div>
            <div style={{background:'var(--ink3)',border:'1px solid var(--rim)',borderRadius:8,padding:12}}>
              <div style={{fontSize:13,fontWeight:600,color:'var(--snow)',marginBottom:3}}>{f.pkg_name||t('pkgPh')}</div>
              <div style={{fontSize:11,color:'var(--fog)'}}>{f.items||'—'}</div>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:'var(--gold)',marginTop:10}}>{f.price===''?'—':parseFloat(f.price)===0?t('free'):`$${f.price}`}</div>
          </div>
        </div>
      </div>
    </div>
  </>
}

function DashParts({ regs, events, t, lang, onExport }: any) {
  if(!regs.length) return <><DH title={lang==='ar'?'المشاركون':'Participants'}/><Empty ico="◎" title={t('noRegTitle')} desc={t('noRegDesc')}/></>
  return <>
    <DH title={lang==='ar'?'المشاركون':'Participants'} sub={`${regs.length} ${lang==='ar'?'مشارك':'registrations'}`} action={{l:`⬇ ${t('exportCsv')}`,f:onExport,ghost:true}}/>
    <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,overflow:'hidden'}}>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['colName','colPhone','colEvent','colPkg','colDate','colTime'].map(k=><th key={k} style={{padding:'10px 16px',fontSize:10,fontWeight:700,color:'var(--fog)',textTransform:'uppercase',letterSpacing:'.08em',textAlign:'left',borderBottom:'1px solid var(--rim)',whiteSpace:'nowrap'}}>{t(k)}</th>)}</tr></thead>
          <tbody>{regs.map((r:Registration)=>{const ev=events.find((e:Event)=>e.id===r.event_id);return<tr key={r.id} style={{borderBottom:'1px solid rgba(44,44,68,.6)'}}><td style={{padding:'11px 16px',fontSize:13,fontWeight:500}}>{r.name}</td><td style={{padding:'11px 16px',fontSize:13,color:'var(--mist)'}}>{r.phone}</td><td style={{padding:'11px 16px',fontSize:13,color:'var(--mist)'}}>{ev?.title||'—'}</td><td style={{padding:'11px 16px',fontSize:13}}><span style={{background:'rgba(46,196,182,.12)',color:'var(--teal)',border:'1px solid rgba(46,196,182,.22)',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{r.package_name||'—'}</span></td><td style={{padding:'11px 16px',fontSize:13,color:'var(--fog)'}}>{r.chosen_date||'—'}</td><td style={{padding:'11px 16px',fontSize:13,color:'var(--fog)'}}>{r.chosen_time||'—'}</td></tr>})}</tbody>
        </table>
      </div>
    </div>
  </>
}

function DashAnalytics({ events, regs, t, lang }: any) {
  if(!regs.length) return <><DH title={t('anTitle')}/><Empty ico="◬" title={t('anTitle')} desc={t('anEmpty')}/></>
  const em: Record<string,number>={}; regs.forEach((r:Registration)=>{em[r.event_id]=(em[r.event_id]||0)+1})
  const sorted=Object.entries(em).sort((a:any,b:any)=>b[1]-a[1])
  const top=sorted.length?(events.find((e:Event)=>e.id===sorted[0][0]) as any)?.title||'—':'—'
  return <>
    <DH title={t('anTitle')}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
      {[{l:t('statReg'),v:regs.length,c:'var(--snow)'},{l:lang==='ar'?'فعاليات نشطة':'Active Events',v:events.filter((e:Event)=>e.status==='published').length,c:'var(--sage)'},{l:lang==='ar'?'الأكثر حجزاً':'Most Booked',v:top,c:'var(--gold)',sm:true}].map(({l,v,c,sm}:any)=>(
        <div key={l} style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:20}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--fog)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>{l}</div>
          <div style={{fontFamily:sm?'inherit':"'Cormorant Garamond',serif",fontSize:sm?14:30,fontWeight:700,color:c,lineHeight:1}}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:20}}>
      <div style={{fontSize:14,fontWeight:600,color:'var(--snow)',marginBottom:20}}>{lang==='ar'?'التسجيلات حسب الفعالية':'Registrations by Event'}</div>
      <div style={{display:'flex',alignItems:'flex-end',gap:6,height:90}}>
        {sorted.map(([id,cnt]:any)=>{const ev:any=events.find((e:Event)=>e.id===id)||{};const max:any=sorted[0][1];return<div key={id} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}} title={`${ev.title||id}: ${cnt}`}><div style={{height:Math.round(cnt/max*80),borderRadius:'4px 4px 0 0',width:'100%',background:'linear-gradient(to top,var(--gold2),var(--gold))'}}/><div style={{fontSize:10,color:'var(--fog)'}}>{ev.emoji||'◈'}</div></div>})}
      </div>
    </div>
  </>
}

function DashPolls({ pollVotes, t, lang }: any) {
  const c: Record<number,number>={}; pollVotes.forEach((v:any)=>{c[v.option_index]=(c[v.option_index]||0)+1})
  const total=Object.values(c).reduce((a:any,b:any)=>a+b,0)
  return <>
    <DH title={t('pollsTitle')} sub={`${total} ${lang==='ar'?'صوت':'votes'}`}/>
    <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:24}}>
      <div style={{fontSize:16,fontWeight:600,color:'var(--snow)',marginBottom:24}}>{t('pollQ')}</div>
      {POLL_OPTS.map((p,i)=>{const cnt=c[i]||0;const pct=total>0?Math.round(cnt/total*100):0;return(
        <div key={i} style={{position:'relative',overflow:'hidden',display:'flex',alignItems:'center',gap:14,padding:'13px 16px',borderRadius:10,border:'1px solid rgba(232,184,75,.4)',background:'rgba(232,184,75,.05)',marginBottom:10}}>
          <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:'rgba(232,184,75,.06)',pointerEvents:'none'}}/>
          <span style={{fontSize:22,position:'relative',zIndex:1}}>{p.e}</span>
          <span style={{flex:1,fontSize:13,color:'var(--snow)',position:'relative',zIndex:1}}>{lang==='ar'?p.ar:p.en}</span>
          <span style={{fontSize:13,fontWeight:600,color:'var(--gold)',position:'relative',zIndex:1}}>{cnt} ({pct}%)</span>
        </div>
      )})}
    </div>
  </>
}

// ── EVENT PAGE ────────────────────────────────────────────
function EventPage({ ev, t, lang, onBack, onRegister }: any) {
  const [cd,setCd]=useState({d:0,h:0,m:0,s:0})
  const [selTime,setSelTime]=useState(ev.time||'08:00')
  const cl=EV_COLORS[ev.color_index%EV_COLORS.length]
  const pr=ev.price>0?`$${ev.price}`:ev.price===0?t('free'):''
  const times=[ev.time||'08:00','10:00','12:00']

  useEffect(()=>{
    const target=ev.date?new Date(ev.date):new Date(Date.now()+14*864e5)
    const upd=()=>{const diff=+target-Date.now();if(diff<0){setCd({d:0,h:0,m:0,s:0});return};setCd({d:Math.floor(diff/864e5),h:Math.floor(diff%864e5/36e5),m:Math.floor(diff%36e5/6e4),s:Math.floor(diff%6e4/1e3)})}
    upd();const id=setInterval(upd,1000);return()=>clearInterval(id)
  },[ev.date])

  const sL: Record<string,string> = {published:t('sPub'),voting:t('sVoting'),draft:t('sDraft'),closed:t('sClosed')}

  const jiggle=(e:any)=>{const el=e.currentTarget;const dx=(Math.random()-.5)*100;const dy=(Math.random()-.5)*24;el.style.transform=`translate(${dx}px,${dy}px)`;setTimeout(()=>{if(el)el.style.transform='translate(0,0)'},700)}

  return (
    <div>
      <div style={{minHeight:380,display:'flex',alignItems:'flex-end',padding:32,position:'relative',overflow:'hidden',background:cl.bg}}>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:130,filter:'blur(2px)',transform:'scale(1.12)'}}>{ev.emoji}</div>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,8,14,.92) 0%,rgba(8,8,14,.3) 60%,transparent 100%)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <button onClick={onBack} style={{background:'rgba(255,255,255,.08)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.12)',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:12,cursor:'pointer',marginBottom:16}}>{t('backBtn')}</button>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:10,fontWeight:600,background:'rgba(8,8,14,.7)',color:'var(--ghost)'}}>{ev.category}</span>
            <span style={{padding:'4px 11px',borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',...statusStyle(ev.status)}}>{sL[ev.status]||ev.status}</span>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(28px,4vw,46px)',fontWeight:700,color:'#fff',marginBottom:8}}>{ev.title}</div>
          <div style={{fontSize:14,color:'rgba(255,255,255,.6)'}}>{ev.subtitle} {ev.date?`· ${ev.date}`:''}</div>
        </div>
      </div>
      <div style={{maxWidth:1080,margin:'0 auto',padding:'28px 24px 60px',display:'grid',gridTemplateColumns:'1fr 320px',gap:24}}>
        <div>
          {ev.description&&<PS title={lang==='ar'?'عن الفعالية':'About'}><p style={{fontSize:14,color:'var(--mist)',lineHeight:1.85}}>{ev.description}</p></PS>}
          <PS title={lang==='ar'?'العد التنازلي':t('back').replace('← ','')==='All Events'?'Countdown':'العد التنازلي'}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {[{n:cd.d,l:lang==='ar'?'أيام':'Days'},{n:cd.h,l:lang==='ar'?'ساعات':'Hours'},{n:cd.m,l:lang==='ar'?'دقائق':'Mins'},{n:cd.s,l:lang==='ar'?'ثواني':'Secs'}].map(({n,l})=>(
                <div key={l} style={{background:'var(--ink3)',border:'1px solid var(--rim)',borderRadius:9,padding:'14px 8px',textAlign:'center'}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:'var(--snow)',lineHeight:1}}>{String(n).padStart(2,'0')}</div>
                  <div style={{fontSize:10,color:'var(--fog)',textTransform:'uppercase',letterSpacing:'.06em',marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
          </PS>
          <PS title={lang==='ar'?'أوقات الانطلاق':'Departure Times'}>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>{times.map(tm=><span key={tm} onClick={()=>setSelTime(tm)} style={{background:selTime===tm?'rgba(232,184,75,.1)':'var(--ink3)',border:`1px solid ${selTime===tm?'rgba(232,184,75,.4)':'var(--rim)'}`,color:selTime===tm?'var(--gold)':'var(--mist)',borderRadius:8,padding:'8px 14px',fontSize:13,cursor:'pointer',transition:'.18s'}}>{tm}</span>)}</div>
          </PS>
          {ev.items&&<PS title={lang==='ar'?'ما يشمله':t('pkgItems')}><ul style={{listStyle:'none'}}>{ev.items.split(',').map((item:string)=><li key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--mist)',padding:'8px 0',borderBottom:'1px solid rgba(44,44,68,.6)'}}><div style={{width:20,height:20,borderRadius:'50%',background:'rgba(123,198,126,.12)',border:'1px solid rgba(123,198,126,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--sage)',flexShrink:0}}>✓</div>{item.trim()}</li>)}</ul></PS>}
          {ev.meeting_point&&<PS title={lang==='ar'?'نقطة التجمع':t('meetPt')}><div style={{background:'var(--ink3)',border:'1px solid var(--rim)',borderRadius:8,padding:14,fontSize:13,color:'var(--mist)'}}>📍 {ev.meeting_point}</div></PS>}
        </div>
        <div>
          <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:24,position:'sticky',top:78}}>
            {pr&&<><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:'var(--gold)',lineHeight:1,marginBottom:3}}>{pr}</div><div style={{fontSize:12,color:'var(--fog)',marginBottom:20}}>{t('perPerson')}</div></>}
            {ev.pkg_name&&<div style={{border:'1px solid rgba(232,184,75,.5)',background:'rgba(232,184,75,.05)',borderRadius:10,padding:15,marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:600,color:'var(--snow)',marginBottom:4}}>{ev.pkg_name}</div>
              {ev.items&&<div style={{fontSize:12,color:'var(--fog)',marginBottom:pr?8:0,lineHeight:1.6}}>{ev.items}</div>}
              {pr&&<div style={{fontSize:16,fontWeight:700,color:'var(--gold)'}}>{pr}</div>}
            </div>}
            {ev.status==='published'?<>
              <button onClick={()=>onRegister(ev)} className="btn-gold" style={{width:'100%',padding:15,borderRadius:11,fontSize:15,marginTop:16,position:'relative',overflow:'hidden'}}>
                {t('pubBookBtn')} <span style={{position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',fontSize:16}}>🎉</span>
              </button>
              <div style={{textAlign:'center',marginTop:12}}><button onMouseOver={jiggle} style={{fontSize:12,color:'var(--fog)',background:'none',border:'none',cursor:'pointer',transition:'all .25s ease',display:'inline-block'}}>{t('noBtn')}</button></div>
            </>:<div style={{background:'rgba(232,184,75,.07)',border:'1px solid rgba(232,184,75,.2)',borderRadius:9,padding:14,fontSize:13,color:'var(--gold)',textAlign:'center',marginTop:12}}>{t('notPub')}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── REGISTRATION FLOW ─────────────────────────────────────

// ── REGISTRATION FLOW ─────────────────────────────────────
function RegFlow({ ev, t, lang, onBack, onDone }: any) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [selDate, setSelDate] = useState(ev.date || '')
  const [selTime, setSelTime] = useState(ev.time || '08:00')
  const [ref, setRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const pkg = ev.pkg_name || 'Standard'
  const steps = [t('regS1'), t('regS2'), t('regS3'), t('regS4'), t('regS5')]
  const times = [ev.time || '08:00', '10:00', '12:00']
  const dates = ev.date ? [ev.date] : []
  const price = ev.price
  const prStr = price > 0 ? '$' + price : price === 0 ? t('free') : ''

  const submit = async () => {
    if (!name.trim() || !phone.trim()) { setErr(t('required')); return }
    setLoading(true)
    const newRef = 'SAF-' + Math.floor(10000 + Math.random() * 90000)
    const body = {
      event_id: ev.id, name: name.trim(), phone: phone.trim(),
      notes, package_name: pkg,
      chosen_date: selDate || null, chosen_time: selTime || null,
      ref_code: newRef, status: 'confirmed'
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    setLoading(false)
    if (res.ok) { setRef(newRef); setStep(4) }
    else { setErr(lang === 'ar' ? 'حدث خطأ' : 'Error, try again') }
  }

  const chipStyle = (sel: boolean) => ({
    background: sel ? 'rgba(232,184,75,.1)' : 'var(--ink3)',
    border: '1px solid ' + (sel ? 'rgba(232,184,75,.4)' : 'var(--rim)'),
    color: sel ? 'var(--gold)' : 'var(--mist)',
    borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', transition: '.18s'
  })

  const navRow = (backFn: any, nextFn: any, nextLabel?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
      {backFn
        ? <button onClick={backFn} style={{ background: 'transparent', border: '1px solid var(--rim)', color: 'var(--mist)', padding: '10px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>{t('back')}</button>
        : <span />
      }
      <button onClick={nextFn} disabled={loading} className="btn-gold" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13 }}>
        {loading ? '...' : (nextLabel || t('next'))}
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '40px 20px 60px' }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
        {steps.map((s: string, i: number) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            {i < steps.length - 1 && <div style={{ position: 'absolute', top: 15, left: '50%', width: '100%', height: 1, background: 'var(--rim)' }} />}
            <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, zIndex: 1, background: i < step ? 'var(--sage)' : i === step ? 'var(--gold)' : 'var(--ink3)', border: i < step || i === step ? 'none' : '1px solid var(--rim)', color: i < step || i === step ? 'var(--ink)' : 'var(--fog)' }}>
              {i < step ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 10, color: 'var(--fog)', marginTop: 6, textAlign: 'center' }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--rim)', borderRadius: 24, padding: 32 }}>
        {/* Step 0 - Package */}
        {step === 0 && (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5 }}>{t('selPkg')}</div>
            <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{t('subPkg')}</div>
            <div style={{ border: '1px solid rgba(232,184,75,.5)', background: 'rgba(232,184,75,.05)', borderRadius: 10, padding: 15 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--snow)', marginBottom: 4 }}>{pkg}</div>
              {ev.items && <div style={{ fontSize: 12, color: 'var(--fog)', lineHeight: 1.6, marginBottom: prStr ? 8 : 0 }}>{ev.items}</div>}
              {prStr && <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{prStr}</div>}
            </div>
            {navRow(null, () => setStep(1))}
          </>
        )}

        {/* Step 1 - Date */}
        {step === 1 && (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5 }}>{t('selDate')}</div>
            <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{t('subDate')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {dates.length > 0
                ? dates.map((d: string) => <span key={d} onClick={() => setSelDate(d)} style={chipStyle(selDate === d)}>{d}</span>)
                : <span style={{ fontSize: 13, color: 'var(--fog)' }}>{lang === 'ar' ? 'لم يحدد تاريخ بعد' : 'No date set yet'}</span>
              }
            </div>
            {navRow(() => setStep(0), () => setStep(2))}
          </>
        )}

        {/* Step 2 - Time */}
        {step === 2 && (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5 }}>{t('selTime')}</div>
            <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{t('subTime')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {times.map((tm: string) => <span key={tm} onClick={() => setSelTime(tm)} style={chipStyle(selTime === tm)}>{tm}</span>)}
            </div>
            {navRow(() => setStep(1), () => setStep(3))}
          </>
        )}

        {/* Step 3 - Details */}
        {step === 3 && (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5 }}>{t('yourDets')}</div>
            <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{t('subDets')}</div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 7 }}>{t('nameL')} *</label>
              <input className="safar-input" type="text" placeholder={t('namePh')} value={name} onChange={e => { setName(e.target.value); setErr('') }} />
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 7 }}>{t('phoneL')} *</label>
              <input className="safar-input" type="tel" placeholder={t('phonePh')} value={phone} onChange={e => { setPhone(e.target.value); setErr('') }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 7 }}>{t('notesL')}</label>
              <textarea className="safar-input" placeholder={t('notesPh')} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical', minHeight: 80 }} />
            </div>
            {err && <div style={{ fontSize: 12, color: 'var(--coral)', marginTop: 8 }}>{err}</div>}
            {navRow(() => setStep(2), submit, t('confirm'))}
          </>
        )}

        {/* Step 4 - Done */}
        {step === 4 && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: 'var(--snow)', marginBottom: 5 }}>{t('bookDone')}</div>
              <div style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 24 }}>{t('subDone')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>{t('invReady')}</div>
            </div>
            <div style={{ maxWidth: 320, margin: '0 auto 16px', borderRadius: 18, overflow: 'hidden', background: INV_BG[ev.color_index % INV_BG.length] }}>
              <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{ev.emoji}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>{ev.subtitle || ev.category}</div>
              </div>
              <div style={{ padding: '4px 24px 16px' }}>
                {[
                  [t('nameL'), name],
                  [lang === 'ar' ? 'التاريخ' : 'Date', selDate || '—'],
                  [lang === 'ar' ? 'الوقت' : 'Time', selTime || '—'],
                  [lang === 'ar' ? 'الباقة' : 'Package', pkg],
                  ...(prStr ? [[lang === 'ar' ? 'السعر' : 'Price', prStr]] : []),
                ].map(([k, v]: any) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(255,255,255,.4)' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 24px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ width: 80, height: 80, borderRadius: 9, margin: '0 auto 8px', background: 'rgba(255,255,255,.08)', border: '1px dashed rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'rgba(255,255,255,.3)' }}>QR</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em' }}>{ref}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
              {['⬇ PNG', '📄 PDF', lang === 'ar' ? '💬 واتساب' : '💬 WhatsApp'].map((l: string) => (
                <button key={l} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--rim2)', background: 'var(--card2)', color: 'var(--snow)', fontSize: 12, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
            <button onClick={onDone} style={{ width: '100%', padding: '10px 20px', borderRadius: 8, fontSize: 13, background: 'transparent', border: '1px solid var(--rim)', color: 'var(--mist)', cursor: 'pointer' }}>{t('backHome')}</button>
          </>
        )}
      </div>
    </div>
  )
}
// ── HELPERS ───────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  return <div style={{position:'fixed',bottom:32,left:'50%',transform:'translateX(-50%)',background:'var(--card2)',border:'1px solid var(--rim2)',padding:'12px 24px',borderRadius:10,fontSize:13,color:'var(--snow)',whiteSpace:'nowrap',zIndex:9999,animation:'fadeUp .3s ease'}}>{msg}</div>
}
function SectionTag({ children }: any) {
  return <div style={{display:'inline-flex',alignItems:'center',gap:7,border:'1px solid rgba(232,184,75,.2)',background:'rgba(232,184,75,.05)',borderRadius:50,padding:'5px 14px',fontSize:10,fontWeight:700,color:'var(--gold)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>{children}</div>
}
function SectionTitle({ children, lang }: any) {
  return <h2 style={{fontFamily:lang==='ar'?'Noto Kufi Arabic,sans-serif':"'Cormorant Garamond',serif",fontSize:'clamp(32px,4.5vw,52px)',fontWeight:700,color:'var(--snow)',marginBottom:14,lineHeight:1.08}}>{children}</h2>
}
function PS({ title, children }: any) {
  return <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:22,marginBottom:16}}><div style={{fontSize:12,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:16}}>{title}</div>{children}</div>
}
function DH({ title, sub, action }: any) {
  return <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:28}}>
    <div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:'var(--snow)'}}>{title}</div>
      {sub&&<div style={{fontSize:13,color:'var(--fog)',marginTop:3}}>{sub}</div>}
    </div>
    {action&&<button onClick={action.f} className={action.ghost?'':'btn-gold'} style={{padding:'10px 20px',borderRadius:8,fontSize:13,border:action.ghost?'1px solid var(--rim)':'none',background:action.ghost?'transparent':undefined,color:action.ghost?'var(--mist)':undefined,cursor:'pointer'}}>{action.l}</button>}
  </div>
}
function Empty({ ico, title, desc, cta, onCta }: any) {
  return <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'72px 20px',textAlign:'center'}}>
    <div style={{fontSize:48,opacity:.25,marginBottom:20}}>{ico}</div>
    <div style={{fontSize:17,fontWeight:600,color:'var(--mist)',marginBottom:8}}>{title}</div>
    <div style={{fontSize:13,color:'var(--fog)',marginBottom:24}}>{desc}</div>
    {cta&&<button onClick={onCta} className="btn-gold" style={{padding:'10px 20px',borderRadius:8,fontSize:13,border:'none',cursor:'pointer'}}>{cta}</button>}
  </div>
}
function FP({ title, children }: any) {
  return <div style={{background:'var(--card)',border:'1px solid var(--rim)',borderRadius:16,padding:24,marginBottom:16}}>
    <div style={{fontSize:13,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:18,paddingBottom:12,borderBottom:'1px solid var(--rim)'}}>{title}</div>
    {children}
  </div>
}
function FR({ label, children }: any) {
  return <div style={{display:'flex',flexDirection:'column',gap:7}}><label style={{fontSize:11,fontWeight:700,color:'var(--ghost)',textTransform:'uppercase',letterSpacing:'.08em'}}>{label}</label>{children}</div>
}
function statusStyle(s: string) {
  const m: Record<string,any> = {
    published:{background:'rgba(123,198,126,.15)',color:'var(--sage)',border:'1px solid rgba(123,198,126,.25)'},
    voting:{background:'rgba(232,184,75,.12)',color:'var(--gold)',border:'1px solid rgba(232,184,75,.22)'},
    draft:{background:'rgba(80,80,117,.2)',color:'var(--fog)',border:'1px solid rgba(80,80,117,.3)'},
    closed:{background:'rgba(255,107,107,.1)',color:'var(--coral)',border:'1px solid rgba(255,107,107,.2)'},
  }
  return m[s]||m.draft
}
