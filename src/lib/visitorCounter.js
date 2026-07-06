import { supabase } from './supabase'

const SESSION_FLAG = 'sudah_dihitung_kunjungan'

export function recordVisitOnce() {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem(SESSION_FLAG)) return
  sessionStorage.setItem(SESSION_FLAG, '1')
  supabase.rpc('increment_page_view').then(() => {})
}
