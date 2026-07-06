export default function ReorderableToggleList({ items, onToggle, onMove, compact = false }) {
  const rowPad = compact ? 'p-2.5' : 'p-4'
  const labelSize = compact ? 'text-xs' : 'text-sm'
  const badgeSize = compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
  const maxWidth = compact ? 'max-w-sm' : 'max-w-xl'

  return (
    <div className={`bg-white border border-ink/10 rounded-lg divide-y divide-ink/10 ${maxWidth}`}>
      {items.map((s, i) => (
        <div key={s.key} className={`flex items-center justify-between gap-3 ${rowPad}`}>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => onMove(i, -1)}
                disabled={i === 0}
                className="text-ink/70 hover:text-chalkboard disabled:opacity-20 leading-none text-xs"
                aria-label="Naikkan urutan"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onMove(i, 1)}
                disabled={i === items.length - 1}
                className="text-ink/70 hover:text-chalkboard disabled:opacity-20 leading-none text-xs"
                aria-label="Turunkan urutan"
              >
                ▼
              </button>
            </div>
            <span className={`font-medium ${labelSize}`}>{s.label}</span>
          </div>
          <button
            type="button"
            onClick={() => onToggle(s.key)}
            className={`font-medium rounded shrink-0 ${badgeSize} ${s.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}
          >
            {s.aktif ? 'Tampil' : 'Disembunyikan'}
          </button>
        </div>
      ))}
    </div>
  )
}
