import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, extname } from 'path'

const inputDir = process.argv[2] || '../导航栏'
const outputDir = join(inputDir, 'processed')

async function removeWhiteBg() {
  await mkdir(outputDir, { recursive: true })

  const files = await readdir(inputDir)
  const pngFiles = files.filter(f => extname(f).toLowerCase() === '.png')

  for (const file of pngFiles) {
    const inputPath = join(inputDir, file)
    const outputPath = join(outputDir, file)

    try {
      const metadata = await sharp(inputPath).metadata()
      console.log(`处理: ${file} (${metadata.width}x${metadata.height})`)

      await sharp(inputPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
          const pixels = Buffer.from(data)
          const channels = info.channels

          for (let i = 0; i < pixels.length; i += channels) {
            const r = pixels[i]
            const g = pixels[i + 1]
            const b = pixels[i + 2]

            // 白色或接近白色 → 透明
            if (r > 240 && g > 240 && b > 240) {
              pixels[i + 3] = 0
            }
            // 灰色边缘抗锯齿 → 半透明
            else if (r > 200 && g > 200 && b > 200) {
              const alpha = Math.round(((255 - r) + (255 - g) + (255 - b)) / 3)
              pixels[i + 3] = Math.min(pixels[i + 3], alpha)
            }
          }

          return sharp(pixels, {
            raw: { width: info.width, height: info.height, channels }
          }).png().toFile(outputPath)
        })

      console.log(`✓ ${outputPath}`)
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`)
    }
  }
}

removeWhiteBg().catch(console.error)