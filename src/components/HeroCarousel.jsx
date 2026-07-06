import { useEffect, useState } from 'react'

export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0)
  const slides = images?.length ? images : []

  useEffect(() => {
    if (slides.length <= 1) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <section className="relative h-72 md:h-[26rem] bg-chalkboard overflow-hidden">
      {slides.map((url, i) => (
        <div
          key={url + i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url("${url}")`, opacity: i === index ? 1 : 0 }}
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Gambar ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === index ? 'bg-amber' : 'bg-paper/40 hover:bg-paper/70'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute chalk-divider bottom-0 inset-x-0" />
    </section>
  )
}
