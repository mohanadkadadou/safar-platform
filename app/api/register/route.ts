import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.event_id || !body.name || !body.phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: ev } = await supabase
    .from('events')
    .select('id, status, capacity')
    .eq('id', body.event_id)
    .single()

  if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (ev.status !== 'published') return NextResponse.json({ error: 'Event not open for registration' }, { status: 403 })

  const { data, error } = await supabase.from('registrations').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('event_id')
  let query = supabase.from('registrations').select('*').order('created_at', { ascending: false })
  if (eventId) query = query.eq('event_id', eventId)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
