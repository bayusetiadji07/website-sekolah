import { useState } from 'react'
import { supabase } from '../../lib/supabase'

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
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Kotak Saran</h1>
      <div className="chalk-divider w-24 mb-8" />
      <p className="text-ink/70 mb-8">
        Punya masukan, kritik, atau saran untuk kemajuan sekolah? Sampaikan lewat form di bawah ini.
        Nama dan kontak bersifat opsional.
      </p>

      {sent ? (
        <div className="bg-white border border-ink/10 rounded-lg p-8 text-center">
          <p className="font-display font-bold text-lg mb-2">Terima kasih! 🙏</p>
          <p className="text-ink/70 mb-4">Saran Anda sudah kami terima dan akan menjadi bahan evaluasi sekolah.</p>
          <button
            onClick={() => setSent(false)}
            className="text-rust font-medium hover:underline text-sm"
          >
            Kirim saran lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-6 space-y-3">
          <input
            placeholder="Nama (opsional)"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Kontak: email/WhatsApp (opsional)"
            value={form.kontak}
            onChange={(e) => setForm({ ...form, kontak: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Tulis saran atau masukan Anda di sini..."
            required
            rows={5}
            value={form.isi}
            onChange={(e) => setForm({ ...form, isi: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-rust">{error}</p>}
          <button
            disabled={sending}
            className="bg-chalkboard text-paper px-5 py-2.5 rounded text-sm font-medium disabled:opacity-60"
          >
            {sending ? 'Mengirim...' : 'Kirim Saran'}
          </button>
        </form>
      )}
    </div>
  )
}
