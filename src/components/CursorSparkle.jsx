import { useEffect, useRef } from 'react'

// Warna percikan mengikuti palet ceria sekolah
const COLORS = ['#f97316', '#facc15', '#38bdf8', '#22c55e', '#fb7185']

const MAX_PARTICLES = 55
const SPAWN_DISTANCE = 14 // jarak gerak mouse (px) sebelum percikan baru muncul

/**
 * Jejak percikan bintang yang mengikuti gerak mouse.
 * - Hanya aktif di perangkat dengan mouse (pointer: fine), jadi layar sentuh tidak terpengaruh.
 * - Mati otomatis bila pengguna mengaktifkan "kurangi animasi" di perangkatnya.
 * - Kanvas memakai pointer-events: none sehingga tidak pernah menghalangi klik.
 */
export default function CursorSparkle() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let particles = []
    let raf = null
    let lastTime = 0
    let lastX = null
    let lastY = null

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Bentuk bintang percik 4 sudut (cekung), bukan bulatan biasa
    function drawSparkle(x, y, r, rot, color, alpha) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = r * 1.6
      ctx.beginPath()
      ctx.moveTo(0, -r)
      ctx.quadraticCurveTo(0, 0, r, 0)
      ctx.quadraticCurveTo(0, 0, 0, r)
      ctx.quadraticCurveTo(0, 0, -r, 0)
      ctx.quadraticCurveTo(0, 0, 0, -r)
      ctx.fill()
      ctx.restore()
    }

    function spawn(x, y, speed) {
      // makin cepat gerak mouse, makin besar & makin melesat percikannya
      const boost = Math.min(speed / 28, 1)
      particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 40,
        vy: -12 - Math.random() * 26,
        r: 3 + Math.random() * 4 + boost * 3,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 4,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 0,
        maxLife: 0.55 + Math.random() * 0.35,
      })
      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES)
      }
    }

    function frame(now) {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
      lastTime = now

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      particles = particles.filter((p) => {
        p.life += dt
        if (p.life >= p.maxLife) return false

        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 52 * dt // sedikit gravitasi supaya jatuh melengkung
        p.rot += p.vrot * dt

        const t = p.life / p.maxLife
        const alpha = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75 // muncul cepat, pudar perlahan
        drawSparkle(p.x, p.y, p.r * (1 - t * 0.55), p.rot, p.color, Math.max(alpha, 0))
        return true
      })

      if (particles.length > 0) {
        raf = requestAnimationFrame(frame)
      } else {
        raf = null
        lastTime = 0
      }
    }

    function handleMove(e) {
      if (lastX !== null) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        const dist = Math.hypot(dx, dy)
        if (dist < SPAWN_DISTANCE) return
        spawn(e.clientX, e.clientY, dist)
      }
      lastX = e.clientX
      lastY = e.clientY

      if (raf === null) {
        lastTime = 0
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  )
}
