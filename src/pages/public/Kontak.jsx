import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { buildMapsEmbedSrc } from '../../lib/maps'
import SocialIcon from '../../components/SocialIcon'

export default function Kontak() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  const items = [
    { label: 'Alamat', value: p?.alamat },
    { label: 'Telepon', value: p?.telepon },
    { label: 'Email', value: p?.email },
    { label: 'Jam Operasional', value: p?.jam_operasional },
  ].filter((i) => i.value)

  const socials = [
    { icon: 'instagram', label: 'Instagram', value: p?.instagram_url },
    { icon: 'facebook', label: 'Facebook', value: p?.facebook_url },
    { icon: 'youtube', label: 'YouTube', value: p?.youtube_url },
    { icon: 'tiktok', label: 'TikTok', value: p?.tiktok_url },
  ].filter((s) => s.value)

  const mapsSrc = buildMapsEmbedSrc(p?.maps_embed_url, p?.alamat)

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Kontak</h1>
      <div className="chalk-divider w-24 mb-8" />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-lg shadow-sm p-6">
          <h2 className="font-display text-xl font-bold mb-4">Informasi Kontak</h2>
          {items.length === 0 ? (
            <p className="text-ink/70">Informasi kontak belum diisi.</p>
          ) : (
            <dl className="space-y-3 text-sm">
              {items.map((i) => (
                <div key={i.label}>
                  <dt className="text-xs text-rust font-medium uppercase">{i.label}</dt>
                  <dd className="text-ink/80">{i.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {socials.length > 0 && (
            <div className="mt-5 pt-5 border-t border-ink/10 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.value}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="text-chalkboard hover:text-rust transition-colors"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg overflow-hidden border border-ink/10 bg-white min-h-64">
          {mapsSrc ? (
            <iframe
              src={mapsSrc}
              className="w-full h-full min-h-64"
              loading="lazy"
              title="Lokasi Sekolah"
            />
          ) : (
            <div className="w-full h-full min-h-64 flex items-center justify-center text-ink/70 text-sm p-6 text-center">
              Peta lokasi belum ditambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
