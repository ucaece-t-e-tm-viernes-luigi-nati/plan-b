// Convierte public/images/*.png a WebP livianos (< 250 KB). Uso: npm run images:webp
// sharp viene como dependencia de Next.js, no hace falta instalarlo aparte.
import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const dir = path.join(process.cwd(), 'public', 'images')
const files = (await readdir(dir)).filter((f) => f.endsWith('.png'))
for (const file of files) {
  const src = path.join(dir, file)
  const out = src.replace(/\.png$/, '.webp')
  let quality = 78
  for (;;) {
    await sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality }).toFile(out)
    const { size } = await stat(out)
    if (size < 250 * 1024 || quality <= 40) {
      console.log(`${file} -> ${path.basename(out)} (${Math.round(size / 1024)} KB, q${quality})`)
      break
    }
    quality -= 8
  }
  if (process.argv.includes('--delete-png')) await unlink(src)
}
