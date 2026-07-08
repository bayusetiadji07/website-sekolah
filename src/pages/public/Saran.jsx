import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { MessageSquare, Send, CheckCircle, Heart, User, Mail, ArrowRight } from 'lucide-react'

const empty = { nama: '', kontak: '', isi: '' }

export default function Saran() {
  const [form, setForm] = useState(empty)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    const { error } = await supabase.from('saran').insert(form)
    setSending(false)
    if (error) {
      setError('Gagal mengirim saran. Silakan coba lagi.')
      return
    }
    setForm(empty)
    setSent(true)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Saran</span>
          </div>
          <h1>Kotak Saran</h1>
          <p>Salurkan pendapat Anda untuk kemajuan sekolah</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-12">
        {/* Success State */}
        {sent ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">Terima Kasih!</h2>
            <p className="text-ink-light mb-6 max-w-sm mx-auto">
              Saran Anda sudah kami terima dan akan menjadi bahan evaluasi untuk kemajuan sekolah.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSent(false)}
                className="btn btn-outline"
              >
                Kirim Saran Lain
              </button>
              <Link to="/" className="btn btn-ghost">
                Kembali ke Beranda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Info */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base mb-1">Kami Mendengarkan</h2>
                  <p className="text-sm text-ink-light">
                    Punya masukan, kritik, atau saran untuk kemajuan sekolah? Sampaikan melalui form di bawah ini.
                    Nama dan kontak bersifat opsional.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-ink-light" />
                      Nama (opsional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-ink-light" />
                      Kontak (opsional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Email atau WhatsApp"
                    value={form.kontak}
                    onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                    className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Saran atau Masukan <span className="text-secondary">*</span>
                </label>
                <textarea
                  placeholder="Tulis saran atau masukan Anda di sini..."
                  required
                  rows={5}
                  value={form.isi}
                  onChange={(e) => setForm({ ...form, isi: e.target.value })}
                  className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="btn btn-secondary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Saran
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Footer Note */}
        <p className="text-center text-xs text-ink-light mt-6 flex items-center justify-center gap-1">
          Dibuat dengan <Heart className="w-3 h-3 text-secondary fill-secondary" /> untuk kemajuan SMP Negeri 3 Besuki
        </p>
      </div>
    </div>
  )
}
