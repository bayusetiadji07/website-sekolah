export function buildMapsEmbedSrc(value, fallbackAddress) {
  const trimmed = (value || '').trim()

  if (trimmed.includes('/maps/embed')) return trimmed

  const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (coordMatch) {
    return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`
  }

  const placeMatch = trimmed.match(/\/maps\/place\/([^/@]+)/)
  if (placeMatch) {
    return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')))}&output=embed`
  }

  const isUnresolvableUrl = /^https?:\/\//.test(trimmed)
  if (isUnresolvableUrl) {
    // Shortened links (maps.app.goo.gl) or plain non-embed Google Maps URLs can't be
    // read client-side and are blocked from framing — fall back to the address text.
    const fallback = (fallbackAddress || '').trim()
    return fallback ? `https://www.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed` : ''
  }

  if (trimmed) return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`

  const fallback = (fallbackAddress || '').trim()
  return fallback ? `https://www.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed` : ''
}
