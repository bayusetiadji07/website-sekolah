import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function NavDropdown({ label, active, children, mega }) {
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
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active || open
            ? 'text-secondary bg-secondary/10'
            : 'text-white/85 hover:text-white hover:bg-white/10'
        }`}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 ${mega ? 'w-max' : ''}`}>
          <div
            className={`glass rounded-xl shadow-xl overflow-hidden ${
              mega ? 'min-w-96' : 'min-w-56'
            }`}
          >
            {mega ? (
              children
            ) : (
              <div className="py-2 text-ink">{children}</div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-ink/10" />
        </div>
      )}
    </div>
  )
}
