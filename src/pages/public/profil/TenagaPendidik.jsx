import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Users, User, ArrowRight } from 'lucide-react'

export default function TenagaPendidik() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('tenaga_pendidik').select('*').eq('aktif', true).order('urutan')
      .then(({ data }) => {
        setData(data || [])
        setLoading(false)
      })
  }, [])

  const pendidik = data.filter((d) => d.kategori === 'pendidik')
  const kependidikan = data.filter((d) => d.kategori === 'kependidikan')

  function ProfileCard({ item }) {
    return (
      <div className="card p-8 text-center group hover:border-secondary/30 transition-all duration-300">
        <div className="relative inline-block mb-5">
          {item.foto_url ? (
            <img
              src={item.foto_url}
              alt={item.nama}
              className="w-36 h-36 rounded-full object-cover mx-auto shadow-xl group-hover:shadow-2xl group-hover:shadow-secondary/40 transition-all duration-300 ring-4 ring-transparent group-hover:ring-secondary/30"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary to-secondary shadow-xl group-hover:shadow-2xl group-hover:shadow-secondary/50 flex items-center justify-center mx-auto transition-all duration-300">
              <span className="font-display font-bold text-4xl text-white">{item.nama?.[0]}</span>
            </div>
          )}
          {/* Status indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-white shadow-lg">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
        <h3 className="font-display font-bold text-xl mb-2">{item.nama}</h3>
        <p className="text-base text-ink-light mb-1">{item.jabatan}</p>
        {item.mapel && (
          <p className="text-sm text-secondary mt-1">{item.mapel}</p>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/profil/tenaga-pendidik" className="hover:text-white">Tentang Kami</Link>
            <span>/</span>
            <span className="text-white/60">Tenaga Pendidik</span>
          </div>
          <h1>Tenaga Pendidik & Kependidikan</h1>
          <p>{data.length} tenaga pengajar dan kependidikan</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <p className="font-display font-bold text-3xl">{pendidik.length}</p>
              <p className="text-base text-ink-light">Guru & Pendidik</p>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-3xl">{kependidikan.length}</p>
              <p className="text-base text-ink-light">Tenaga Kependidikan</p>
            </div>
          </div>
        </div>

        {/* Pendidik Section */}
        {pendidik.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users className="w-8 h-8" />
            </div>
            <h3>Belum Ada Data Pendidik</h3>
            <p>Data tenaga pendidik akan ditampilkan di sini.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-secondary" />
              <h2 className="section-title !mb-0">Tenaga Pendidik</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card p-8 text-center">
                    <div className="w-36 h-36 rounded-full skeleton mx-auto mb-5" />
                    <div className="h-5 skeleton w-48 mx-auto mb-2" />
                    <div className="h-4 skeleton w-36 mx-auto" />
                  </div>
                ))
              ) : (
                pendidik.map((t) => <ProfileCard key={t.id} item={t} />)
              )}
            </div>
          </>
        )}

        {/* Kependidikan Section */}
        {kependidikan.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="section-title !mb-0">Tenaga Kependidikan</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {kependidikan.map((t) => <ProfileCard key={t.id} item={t} />)}
            </div>
          </>
        )}

        {/* CTA */}
        {data.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-ink-light mb-4">Tenaga pendidik kami siap membimbing siswa.</p>
            <Link to="/profil/visi-misi" className="btn btn-outline">
              Lihat Visi Misi Sekolah
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
