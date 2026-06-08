// ═══════════════════════════════════════════════════════════
// SAFAR PLATFORM — TypeScript Types
// ═══════════════════════════════════════════════════════════

export type EventStatus = 'draft' | 'voting' | 'published' | 'closed'

export interface Event {
  id: string
  title: string
  subtitle?: string
  description?: string
  emoji: string
  category: string
  status: EventStatus
  date?: string        // ISO date string YYYY-MM-DD
  time?: string        // HH:MM
  meeting_point?: string
  pkg_name: string
  price: number
  items?: string       // comma-separated
  color_index: number
  capacity: number
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  event_id: string
  name: string
  phone: string
  notes?: string
  package_name?: string
  chosen_date?: string
  chosen_time?: string
  ref_code: string
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
}

export interface PollVote {
  id: string
  option_index: number
  voter_token?: string
  created_at: string
}

export interface PollOption {
  index: number
  emoji: string
  label_en: string
  label_ar: string
}

export type Lang = 'en' | 'ar'
