import { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, RemoveFormatting } from 'lucide-react'

const BLOCK_OPTIONS = [
  { value: 'p', label: 'Paragraf' },
  { value: 'h3', label: 'Judul Besar' },
  { value: 'h4', label: 'Judul Kecil' },
]

function ToolbarButton({ icon: Icon, title, onClick }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded hover:bg-ink/10 text-ink/70"
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

// Editor teks kaya sederhana (bold, miring, garis bawah, heading, list, rata teks, tautan)
// berbasis contentEditable + document.execCommand. Menyimpan/mengeluarkan konten sebagai HTML.
export default function RichTextEditor({ value, onChange, placeholder = 'Tulis di sini...', rows = 6 }) {
  const ref = useRef(null)

  // Sinkronkan nilai dari luar hanya saat berbeda dari isi editor saat ini,
  // supaya kursor tidak lompat ke awal setiap kali mengetik.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || ''
    }
  }, [value])

  function emitChange() {
    onChange?.(ref.current?.innerHTML || '')
  }

  function exec(cmd, arg) {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    emitChange()
  }

  function handleLink() {
    const url = window.prompt('Masukkan URL tautan:')
    if (url) exec('createLink', url)
  }

  return (
    <div className="border border-ink/20 rounded overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-ink/10 bg-paper px-1.5 py-1">
        <select
          onChange={(e) => { exec('formatBlock', e.target.value); e.target.value = '' }}
          defaultValue=""
          className="text-xs border border-ink/20 rounded px-1.5 py-1 mr-1 bg-white"
        >
          <option value="" disabled>Format</option>
          {BLOCK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ToolbarButton icon={Bold} title="Tebal" onClick={() => exec('bold')} />
        <ToolbarButton icon={Italic} title="Miring" onClick={() => exec('italic')} />
        <ToolbarButton icon={Underline} title="Garis bawah" onClick={() => exec('underline')} />
        <span className="w-px h-5 bg-ink/10 mx-1" />
        <ToolbarButton icon={List} title="Daftar poin" onClick={() => exec('insertUnorderedList')} />
        <ToolbarButton icon={ListOrdered} title="Daftar nomor" onClick={() => exec('insertOrderedList')} />
        <span className="w-px h-5 bg-ink/10 mx-1" />
        <ToolbarButton icon={AlignLeft} title="Rata kiri" onClick={() => exec('justifyLeft')} />
        <ToolbarButton icon={AlignCenter} title="Rata tengah" onClick={() => exec('justifyCenter')} />
        <ToolbarButton icon={AlignRight} title="Rata kanan" onClick={() => exec('justifyRight')} />
        <span className="w-px h-5 bg-ink/10 mx-1" />
        <ToolbarButton icon={Link2} title="Sisipkan tautan" onClick={handleLink} />
        <ToolbarButton icon={RemoveFormatting} title="Hapus format" onClick={() => exec('removeFormat')} />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        data-placeholder={placeholder}
        className="rich-editor-content px-3 py-2 text-sm text-ink outline-none"
        style={{ minHeight: `${rows * 1.6}em` }}
      />
    </div>
  )
}
