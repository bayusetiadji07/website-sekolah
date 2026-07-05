import { useEffect, useRef, useState } from 'react'

export default function NavDropdown({ label, active, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 hover:text-amber transition-colors ${active ? 'text-amber' : 'text-paper/85'}`}
      >
        {label}
        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-3 z-50">
          <div className="glass rounded-lg shadow-lg py-2 min-w-56 text-ink">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
