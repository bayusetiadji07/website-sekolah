export default function ReorderableToggleList({ items, onToggle, onMove }) {
  return (
    <div className="bg-white border border-ink/10 rounded-lg divide-y divide-ink/10 max-w-xl">
      {items.map((s, i) => (
        <div key={s.key} className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
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
            <span className="font-medium text-sm">{s.label}</span>
          </div>
          <button
            type="button"
            onClick={() => onToggle(s.key)}
            className={`text-xs font-medium px-3 py-1 rounded shrink-0 ${s.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}
          >
            {s.aktif ? 'Tampil' : 'Disembunyikan'}
          </button>
        </div>
      ))}
    </div>
  )
}
