import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Aplikasi() {
  const [data, setData] = useState([])

  useEffect(() => {
    supabase
      .from('app_links')
      .select('*')
      .eq('aktif', true)
      .order('urutan', { ascending: true })
      .then(({ data }) => setData(data || []))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Aplikasi Sekolah</h1>
      <div className="chalk-divider w-24 mb-8" />
      <p className="text-ink/70 mb-8">
        Akses aplikasi resmi yang digunakan sekolah untuk asesmen, administrasi, dan kegiatan siswa.
      </p>

      {data.length === 0 && (
        <p className="text-ink/60">Belum ada aplikasi yang ditautkan.</p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {data.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="bg-white border border-ink/10 rounded-lg p-6 hover:border-amber transition-colors flex items-center gap-4"
          >
            {a.ikon_url ? (
              <img src={a.ikon_url} alt={a.nama} className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 rounded bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard">
                {a.nama?.[0]}
              </div>
            )}
            <div>
              <h3 className="font-display font-bold text-lg">{a.nama}</h3>
              {a.deskripsi && <p className="text-sm text-ink/60">{a.deskripsi}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
