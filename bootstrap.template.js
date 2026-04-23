import brotli from 'brotli'

function base64ToUint8Array(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const payloadBase64 = __PAYLOAD__

console.log("🚀 START")

const compressed = base64ToUint8Array(payloadBase64)

const decompressed = brotli.decompress(compressed)

const js = new TextDecoder().decode(decompressed)

new Function(js)()
