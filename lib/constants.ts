// ═══════════════════════════════════════════════════════════
// SAFAR — Constants & Static Data
// ═══════════════════════════════════════════════════════════

import type { PollOption } from '@/types'

export const EVENT_COLORS = [
  { bg: 'linear-gradient(135deg,#062d4a,#0a4a6e)', thumb: 'rgba(14,165,233,.18)' },
  { bg: 'linear-gradient(135deg,#2d1a04,#4a2c08)', thumb: 'rgba(232,184,75,.18)' },
  { bg: 'linear-gradient(135deg,#051a0c,#0a2e18)', thumb: 'rgba(74,222,128,.18)' },
  { bg: 'linear-gradient(135deg,#0f0b2a,#1a1245)', thumb: 'rgba(155,140,247,.18)' },
  { bg: 'linear-gradient(135deg,#2d0a0a,#4a0f0f)', thumb: 'rgba(255,107,107,.18)' },
  { bg: 'linear-gradient(135deg,#0a2a2a,#0f4040)', thumb: 'rgba(46,196,182,.18)' },
]

export const INV_BG = [
  'linear-gradient(160deg,#06243c,#0a3d60)',
  'linear-gradient(160deg,#2d1200,#4a2000)',
  'linear-gradient(160deg,#041a0a,#072c12)',
  'linear-gradient(160deg,#0c0824,#160f3e)',
  'linear-gradient(160deg,#2a0808,#420f0f)',
  'linear-gradient(160deg,#041e1e,#073232)',
]

export const POLL_OPTIONS: PollOption[] = [
  { index: 0, emoji: '🇹🇷', label_en: 'Antalya Beach Trip',     label_ar: 'رحلة شاطئ أنطاليا' },
  { index: 1, emoji: '🎈', label_en: 'Cappadocia Adventure',    label_ar: 'مغامرة كابادوكيا'   },
  { index: 2, emoji: '🌿', label_en: 'Sapanca Nature Tour',     label_ar: 'جولة طبيعة سابانجا' },
  { index: 3, emoji: '🇦🇪', label_en: 'Dubai Weekend',          label_ar: 'عطلة دبي'           },
  { index: 4, emoji: '⛵', label_en: 'Bosphorus Cruise',        label_ar: 'رحلة البوسفور'      },
]

export const FEATURES = [
  { icon: '🗓️', bg: 'rgba(46,196,182,.1)',   en: { t: 'Multi-date Scheduling', d: 'Multiple dates and departure times per event.' }, ar: { t: 'جدولة متعددة التواريخ', d: 'تواريخ وأوقات انطلاق متعددة لكل فعالية.' } },
  { icon: '🗳️', bg: 'rgba(232,184,75,.1)',  en: { t: 'Voting System',          d: 'Participants vote on dates and destinations.' }, ar: { t: 'نظام التصويت',        d: 'يصوت المشاركون على التواريخ والوجهات.' } },
  { icon: '🎨', bg: 'rgba(155,140,247,.1)', en: { t: 'Event Themes',           d: 'Custom visual identity per event.' },            ar: { t: 'ثيمات الفعاليات',    d: 'هوية بصرية مخصصة لكل فعالية.' } },
  { icon: '📩', bg: 'rgba(255,107,107,.1)', en: { t: 'Invitation Cards',       d: 'Auto-generated invitations with QR codes.' },   ar: { t: 'بطاقات الدعوة',      d: 'بطاقات دعوة تُنشأ تلقائياً مع رموز QR.' } },
  { icon: '📊', bg: 'rgba(123,198,126,.1)', en: { t: 'Real-time Analytics',    d: 'Live insights on registrations and trends.' },   ar: { t: 'تحليلات فورية',      d: 'رؤى حية حول التسجيلات والاتجاهات.' } },
  { icon: '🌐', bg: 'rgba(46,196,182,.1)',  en: { t: 'Bilingual AR/EN',        d: 'Full Arabic & English with RTL support.' },      ar: { t: 'ثنائي اللغة',        d: 'دعم كامل للعربية والإنجليزية مع RTL.' } },
  { icon: '📱', bg: 'rgba(232,184,75,.1)',  en: { t: 'Mobile First',           d: 'Beautiful on every device and screen size.' },   ar: { t: 'محسّن للجوال',      d: 'رائع على كل جهاز وحجم شاشة.' } },
  { icon: '🔐', bg: 'rgba(155,140,247,.1)', en: { t: 'Protected Admin',        d: 'Secure dashboard, public guest access.' },       ar: { t: 'داش بورد محمي',      d: 'لوحة تحكم آمنة، وصول عام للزوار.' } },
]

export const THEMES = [
  { name: { en: 'Ocean Blue',      ar: 'أزرق المحيط'    }, emoji: '🏖️', bg: 'linear-gradient(135deg,#062d4a,#0a4a6e)', p: '#0ea5e9', s: '#0891b2', a: '#7dd3fc' },
  { name: { en: 'Desert Gold',     ar: 'ذهبي الصحراء'   }, emoji: '🐪', bg: 'linear-gradient(135deg,#2d1a04,#4a2c08)', p: '#e8b84b', s: '#c99a2e', a: '#fde68a' },
  { name: { en: 'Forest Green',    ar: 'أخضر الغابة'    }, emoji: '🏔️', bg: 'linear-gradient(135deg,#051a0c,#0a2e18)', p: '#4ade80', s: '#16a34a', a: '#bbf7d0' },
  { name: { en: 'Midnight Violet', ar: 'بنفسجي الليل'   }, emoji: '⛵', bg: 'linear-gradient(135deg,#0f0b2a,#1a1245)', p: '#9b8cf7', s: '#7c6ff7', a: '#ddd6fe' },
]

export const TESTIMONIALS = [
  { stars: 5, en: { t: 'The platform made organizing our beach trip for 40 people feel effortless. The invitation cards were gorgeous!', n: 'Sarah M.', r: 'Trip Organizer' }, ar: { t: 'جعلت المنصة تنظيم رحلة الشاطئ لـ٤٠ شخصاً أمراً سهلاً. بطاقات الدعوة كانت رائعة!', n: 'سارة م.', r: 'منظمة رحلات' } },
  { stars: 5, en: { t: 'The voting system is brilliant. We finally agreed on a date without endless WhatsApp messages!', n: 'Ahmed K.', r: 'Community Manager' }, ar: { t: 'نظام التصويت رائع. أخيراً اتفقنا على موعد دون رسائل واتساب لا نهاية لها!', n: 'أحمد ك.', r: 'مدير مجتمع' } },
  { stars: 5, en: { t: 'Every event having its own visual theme is brilliant. Our yacht party invitation looked incredible.', n: 'Layla R.', r: 'Event Planner' }, ar: { t: 'فكرة ثيم بصري لكل فعالية رائعة تماماً. دعوة حفلة اليخت كانت تبدو مذهلة.', n: 'ليلى ر.', r: 'مخططة فعاليات' } },
]

export const CATEGORIES_EN = ['Beach', 'Adventure', 'Desert', 'Luxury', 'Mountains', 'City', 'Workshop', 'Concert']
export const CATEGORIES_AR = ['شاطئ', 'مغامرة', 'صحراء', 'رفاهية', 'جبال', 'مدينة', 'ورشة', 'حفلة']

export function generateRefCode(): string {
  return 'SAF-' + Math.floor(10000 + Math.random() * 90000)
}
