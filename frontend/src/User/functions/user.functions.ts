export async function resizeAndEncode(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const img: HTMLImageElement = new Image()
    const reader = new FileReader()
    reader.onload = () => {
      img.src = reader.result as string
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)

    img.onload = () => {
      const width = img.width
      const height = img.height

      let canvasWidth, canvasHeight, startX, startY

      if (width > height) {
        canvasWidth = height
        canvasHeight = height
        startX = (width - height) / 2
        startY = 0
      } else {
        canvasWidth = width
        canvasHeight = width
        startX = 0
        startY = (height - width) / 2
      }

      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      const context = canvas.getContext('2d')
      context?.drawImage(
        img,
        startX,
        startY,
        canvasWidth,
        canvasHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      )

      const resizedImageData = canvas.toDataURL('image/png')
      resolve(resizedImageData)
    }

    img.onerror = (error: any) => {
      reject(error)
    }
  })
}
