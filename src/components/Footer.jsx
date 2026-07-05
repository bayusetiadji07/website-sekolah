import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Footer() {
  const [pengaturan, setPengaturan] = useState(null)

  useEffect(() => {
    supabase
      .from('pengaturan_sekolah')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setPengaturan(data))
  }, [])

  return (
    <footer className="glass-dark text-paper/70 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {pengaturan?.logo_url && (
              <img src={pengaturan.logo_url} alt="Logo" className="h-8 w-8 object-contain rounded bg-white/10 p-1" />
            )}
            <p className="font-display font-bold text-paper text-lg">SMP Negeri 3 Besuki</p>
          </div>
          <p>{pengaturan?.tagline || 'Mendidik dengan hati, berprestasi dengan karakter.'}</p>
        </div>
        <div>
          <p className="font-display font-bold text-paper mb-2">Kontak</p>
          {pengaturan?.alamat && <p>{pengaturan.alamat}</p>}
          {pengaturan?.telepon && <p>Telp: {pengaturan.telepon}</p>}
          {pengaturan?.email && <p>Email: {pengaturan.email}</p>}
          <Link to="/kontak" className="inline-block mt-1 text-amber hover:underline">
            Lihat halaman kontak →
          </Link>
        </div>
        <div>
          <p className="font-display font-bold text-paper mb-2">Tautan</p>
          <div className="flex flex-col gap-1">
            <Link to="/profil/sejarah" className="hover:text-amber">Tentang Kami</Link>
            <Link to="/aplikasi" className="hover:text-amber">Aplikasi Sekolah</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} SMP Negeri 3 Besuki. Semua hak cipta dilindungi.
      </div>
    </footer>
  )
}
