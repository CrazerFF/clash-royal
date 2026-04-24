import { readFileSync, writeFileSync } from 'fs'

const js = readFileSync('./dist/game.js', 'utf8')
const pakoInflate = readFileSync('./node_modules/pako/dist/pako_inflate.min.js', 'utf8')

// ⚡ compress (можешь оставить pako в Node)
import pako from 'pako'
const compressed = pako.deflate(js, { level: 9 })
const base64 = Buffer.from(compressed).toString('base64')

const html = `<!DOCTYPE html>
<html>
<head>
<style>
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
}

#app {
    width: 100%;
    height: 100%;
}

#game-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #234644;
}

#game-container canvas {
    display: block;
}
</style>
<meta charset="UTF-8">
<title>Playable</title>
</head>
<body>

<script>
${pakoInflate}
</script>

<script>
const DATA = "${base64}";

function base64ToBytes(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
</script>

<script>
(function () {
  const compressed = base64ToBytes(DATA);

  const code = pako.inflate(compressed, { to: "string" });

  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
})();
</script>

</body>
</html>`

writeFileSync('./dist/index.html', html)

console.log('✅ Playable built with inline pako_inflate')
