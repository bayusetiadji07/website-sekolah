// Kompres & resize gambar di sisi browser sebelum diupload ke Supabase Storage.
// PNG dipertahankan sebagai PNG (supaya transparansi logo/ikon tidak rusak),
// format lain (jpg, webp, dll) dikonversi ke JPEG kualitas tinggi.
// File non-gambar (pdf, svg, gif, dll) dikembalikan apa adanya.
export function compressImage(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = {}) {
  return new Promise((resolve) => {
    if (!file || !file.type?.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)

        const isPng = file.type === 'image/png'
        const outType = isPng ? 'image/png' : 'image/jpeg'
        const outExt = isPng ? 'png' : 'jpg'

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const baseName = file.name.replace(/\.[^.]+$/, '')
            const compressed = new File([blob], `${baseName}.${outExt}`, { type: outType })
            resolve(compressed.size < file.size ? compressed : file)
          },
          outType,
          isPng ? undefined : quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}
