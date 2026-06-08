// ═══════════════════════════════════════════════════════════
// SAFAR — Supabase Clients
// ═══════════════════════════════════════════════════════════
import { createClient as createBrowser } from '@/utils/supabase/client'
import { createServerClient } from '@supabase/ssr'

// ── Browser client (used in React components) ────────────
export const supabase = createBrowser()

// ── Admin server client (used in API routes only) ────────
// Uses service_role key to bypass RLS for admin operations
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Prefer service_role for full access, fall back to publishable
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  return createServerClient(url, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
