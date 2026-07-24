import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { jenisSuratLabel, statusMeta } from '../../../lib/sipas'
import { Search, FileDown, AlertCircle } from 'lucide-react'

export default function CekStatus() {
  const { noTiket } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState(noTiket || '')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function cari(value) {
    if (!value) return
    setLoading(true)
    setError('')
    setData(null)
    const { data: rows, error: rpcError } = await supabase.rpc('sipas_cek_status', { p_no_tiket: value.trim() })
    setLoading(false)
    if (rpcError || !rows || rows.length === 0) {
      setError('Nomor tiket tidak ditemukan. Periksa kembali nomor tiket Anda.')
      return
    }
    setData(rows[0])
  }

  useEffect(() => {
    if (noTiket) cari(noTiket)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noTiket])

  function handleSubmit(e) {
    e.preventDefault()
    navigate(`/sipas/status/${input.trim()}`)
    cari(input)
  }

  return (
    <div>
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/sipas" className="hover:text-white">SIPAS</Link>
            <span>/</span>
            <span className="text-white/60">Cek Status</span>
          </div>
          <h1>Cek Status Pengajuan</h1>
          <p>Masukkan nomor tiket yang Anda terima saat mengajukan surat</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-12">
        <form onSubmit={handleSubmit} className="card p-4 flex gap-3 mb-8">
          <input
            type="text"
            required
            placeholder="Contoh: SPS-260724-0001"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-ink/15 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button type="submit" disabled={loading} className="btn btn-primary shrink-0">
            <Search className="w-4 h-4" />
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {error && (
          <div className="card p-6 flex items-start gap-3 text-red-600 bg-red-50">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {data && (
          <div className="card p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-ink-light mb-1">Nomor Tiket</p>
                <p className="font-mono font-bold text-lg">{data.no_tiket}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusMeta(data.status).className}`}>
                {statusMeta(data.status).label}
              </span>
            </div>

            <dl className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <dt className="text-ink-light">Nama Siswa</dt>
                <dd className="font-medium">{data.nama_siswa}</dd>
              </div>
              <div>
                <dt className="text-ink-light">Kelas</dt>
                <dd className="font-medium">{data.kelas || '-'}</dd>
              </div>
              <div>
                <dt className="text-ink-light">Jenis Surat</dt>
                <dd className="font-medium">{jenisSuratLabel(data.jenis_surat)}</dd>
              </div>
              <div>
                <dt className="text-ink-light">Tanggal Diajukan</dt>
                <dd className="font-medium">
                  {new Date(data.tanggal_ajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </dd>
              </div>
            </dl>

            {data.catatan_admin && (
              <div className="bg-ink/5 rounded-xl p-4 mb-6">
                <p className="text-xs text-ink-light mb-1">Catatan dari Staf TU</p>
                <p className="text-sm">{data.catatan_admin}</p>
              </div>
            )}

            {data.file_url && (
              <a href={data.file_url} target="_blank" rel="noreferrer" className="btn btn-secondary w-full justify-center">
                <FileDown className="w-4 h-4" />
                Unduh Surat
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
