import fs from 'fs'
import { brotliCompressSync, constants } from 'zlib'

console.log("🚀 PACK START")

const input = fs.readFileSync('./dist/bundle.js')
console.log("📦 bundle size:", input.length)

const compressed = brotliCompressSync(input, {
  params: {
    [constants.BROTLI_PARAM_QUALITY]: 11
  }
})

console.log("🧊 compressed size:", compressed.length)

const base64 = compressed.toString('base64')
console.log("🔤 base64 size:", base64.length)

// bootstrap шаблон
let bootstrap = fs.readFileSync('./bootstrap.template.js', 'utf-8')

// проверка плейсхолдера
if (!bootstrap.includes('__PAYLOAD__')) {
  throw new Error("❌ __PAYLOAD__ not found in bootstrap.template.js")
}

bootstrap = bootstrap.replace('__PAYLOAD__', `"${base64}"`)

fs.writeFileSync('./dist/bootstrap.js', bootstrap)

console.log("💾 bootstrap written")

console.log("✅ DONE")

