import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FaviconUpdater() {
  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('logo_url').eq('id', 1).single()
      .then(({ data }) => {
        if (!data?.logo_url) return
        let link = document.querySelector('link[rel="icon"]')
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = data.logo_url
      })
  }, [])

  return null
}
