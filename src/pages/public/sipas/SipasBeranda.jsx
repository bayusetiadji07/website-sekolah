import { Link } from 'react-router-dom'
import { FileText, Search, ClipboardList, ArrowRight, Clock } from 'lucide-react'
import { JENIS_SURAT } from '../../../lib/sipas'

export default function SipasBeranda() {
  return (
    <div>
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">SIPAS</span>
          </div>
          <h1>SIPAS — Sistem Pelayanan Administrasi Siswa</h1>
          <p>Ajukan surat keterangan sekolah secara online, tanpa antre di TU</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <Link to="/sipas/ajukan" className="card p-6 flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                Ajukan Surat
                <ArrowRight className="w-4 h-4 text-ink-light" />
              </h2>
              <p className="text-sm text-ink-light">Isi formulir pengajuan surat sesuai kebutuhan.</p>
            </div>
          </Link>

          <Link to="/sipas/status" className="card p-6 flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                Cek Status
                <ArrowRight className="w-4 h-4 text-ink-light" />
              </h2>
              <p className="text-sm text-ink-light">Lacak pengajuan pakai nomor tiket, tanpa login.</p>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base mb-1">Jenis Surat yang Dilayani</h2>
              <ul className="text-sm text-ink-light grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                {JENIS_SURAT.map((j) => (
                  <li key={j.value} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {j.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm text-ink-light">
          <Clock className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Pengajuan akan diproses oleh staf Tata Usaha pada jam kerja sekolah. Simpan nomor tiket Anda untuk mengecek status.</p>
        </div>
      </div>
    </div>
  )
}
