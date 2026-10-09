const fs = require('fs')
const path = require('path')

// Baca logo PNG
const pngPath = path.join(__dirname, 'public', 'logo-kominfo-landak.png')

if (!fs.existsSync(pngPath)) {
  console.error('❌ File logo tidak ditemukan:', pngPath)
  process.exit(1)
}

const png = fs.readFileSync(pngPath)
const base64 = png.toString('base64')

// Bikin SVG dengan logo di dalam lingkaran putih
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="48" />
    </clipPath>
  </defs>
  <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
  <image
    href="data:image/png;base64,${base64}"
    x="8"
    y="8"
    width="84"
    height="84"
    clip-path="url(#circleClip)"
  />
</svg>`

// Tulis ke public/favicon.svg
const outputPath = path.join(__dirname, 'public', 'favicon.svg')
fs.writeFileSync(outputPath, svg)

console.log('✅ favicon.svg berhasil dibuat!')
console.log('   Ukuran:', (svg.length / 1024).toFixed(1), 'KB')
console.log('   Lokasi:', outputPath)