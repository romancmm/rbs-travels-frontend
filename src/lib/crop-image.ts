import { Area } from 'react-easy-crop'

export const getCroppedImg = (
  file: File,
  croppedAreaPixels: Area,
  quality = 0.8 // 80% quality is usually the "sweet spot"
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return reject('Cannot get canvas context')

      // 1. Set canvas size to the cropped dimensions
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      // 2. Draw the cropped image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      // 3. Convert to WebP with compression
      // We change the file extension to .webp for better optimization
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('Canvas is empty')

          const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webp'
          const croppedFile = new File([blob], fileName, { type: 'image/webp' })

          // Cleanup memory
          URL.revokeObjectURL(image.src)

          resolve(croppedFile)
        },
        'image/webp',
        quality
      )
    }

    image.onerror = () => {
      reject('Error loading image')
      URL.revokeObjectURL(image.src)
    }
  })
}
