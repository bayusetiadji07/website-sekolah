import { useEffect, useRef, useState } from 'react'
import { Users, BookOpen, Trophy, Handshake } from 'lucide-react'

const iconMap = {
  'Tenaga Pendidik': Users,
  'Guru': Users,
  'Fasilitas': BookOpen,
  'Prestasi': Trophy,
  'Mitra Sekolah': Handshake,
  'Mitra': Handshake,
}

export default function StatCounter({ value, label, duration = 1500 }) {
  const [display, setDisplay] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  // Deteksi elemen masuk ke layar — cukup sekali saja.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Jalankan animasi setiap kali `value` berubah (mis. saat data selesai dimuat),
  // selama elemen sudah pernah terlihat di layar.
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, visible, duration])

  const Icon = iconMap[label] || BookOpen

  return (
    <div ref={ref} className="text-center group">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
        <Icon className="w-7 h-7 text-secondary" />
      </div>
      <p className="font-display text-3xl sm:text-4xl font-extrabold text-dark mb-1">
        {display}
        <span className="text-secondary">+</span>
      </p>
      <p className="text-sm text-ink-light font-medium">{label}</p>
    </div>
  )
} 
