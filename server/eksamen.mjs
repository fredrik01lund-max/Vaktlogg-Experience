// Eksamenstjeneren: serverer presentasjonen og videresender sensor-mobilen til storskjermen.
//
//   npm run eksamen            (bygger ikke – kjør npm run build:eksamen først)
//
// Presentasjons-PC-en og mobilen må være på samme nett – en mobil-hotspot eller et lokalt Wi-Fi holder,
// internett trengs ikke. Tjeneren skriver ut adressen mobilen skal åpne. Mobilen sender (?speil=send),
// prototypen i presentasjonen viser (?speil=vis), og tjeneren sender meldingene videre mellom dem.
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocketServer } from 'ws'

const ROT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PORT || 8080)
const MAPPE = [process.argv[2], 'dist-eksamen', 'dist'].filter(Boolean).map((m) => path.resolve(ROT, m)).find((m) => fs.existsSync(path.join(m, 'index.html')))
if (!MAPPE) {
  console.error('Fant ingen bygget presentasjon. Kjør først: npm run build:eksamen')
  process.exit(1)
}

const TYPER = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

const tjener = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname === '/speil-status') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
    res.end(JSON.stringify({ speil: true, mobiler: sendere() }))
    return
  }
  let fil = path.normalize(path.join(MAPPE, decodeURIComponent(url.pathname)))
  if (!fil.startsWith(MAPPE)) {
    res.writeHead(403).end()
    return
  }
  if (fs.existsSync(fil) && fs.statSync(fil).isDirectory()) fil = path.join(fil, 'index.html')
  fs.stat(fil, (feil, st) => {
    if (feil) {
      res.writeHead(404).end('Ikke funnet')
      return
    }
    const type = TYPER[path.extname(fil).toLowerCase()] ?? 'application/octet-stream'
    // Film og lyd må kunne spoles i (Range), ellers hopper nettleseren over dem
    const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range)
    if (range) {
      const start = range[1] ? Number(range[1]) : 0
      const slutt = range[2] ? Number(range[2]) : st.size - 1
      res.writeHead(206, { 'content-type': type, 'content-length': slutt - start + 1, 'content-range': `bytes ${start}-${slutt}/${st.size}`, 'accept-ranges': 'bytes' })
      fs.createReadStream(fil, { start, end: slutt }).pipe(res)
      return
    }
    res.writeHead(200, { 'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes', 'cache-control': 'no-cache' })
    fs.createReadStream(fil).pipe(res)
  })
})

// Videresending: alt én klient sender, går til alle de andre
const wss = new WebSocketServer({ server: tjener, path: '/speil' })
const rolle = new Map()
const sendere = () => [...rolle.values()].filter((r) => r === 'send').length
wss.on('connection', (ws, req) => {
  const fra = req.socket.remoteAddress?.replace('::ffff:', '') ?? '?'
  rolle.set(ws, 'ukjent')
  ws.on('message', (data) => {
    const tekst = String(data)
    try {
      const m = JSON.parse(tekst)
      if (m.type === 'tilstand' && rolle.get(ws) !== 'send') {
        rolle.set(ws, 'send')
        console.log(`  📱 mobilen er koblet til (${fra})`)
      }
      if (m.type === 'hei' && rolle.get(ws) !== 'vis') rolle.set(ws, 'vis')
    } catch {
      return
    }
    for (const annen of wss.clients) if (annen !== ws && annen.readyState === 1) annen.send(tekst)
  })
  ws.on('close', () => {
    if (rolle.get(ws) === 'send') console.log(`  📱 mobilen koblet fra (${fra}) – den kobler seg på igjen av seg selv`)
    rolle.delete(ws)
  })
})

function adresser() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((a) => a && a.family === 'IPv4' && !a.internal)
    .map((a) => a.address)
}

tjener.listen(PORT, '0.0.0.0', () => {
  const ip = adresser()
  console.log(`\nVaktlogg Experience – eksamen (${path.relative(ROT, MAPPE)})\n`)
  console.log(`  Storskjermen:  http://localhost:${PORT}/`)
  if (ip.length) {
    console.log(`  Sensor-mobilen (samme nett som PC-en):`)
    for (const a of ip) console.log(`                 http://${a}:${PORT}/demo/vaktlogg.html?sensor&speil=send`)
  } else {
    console.log('  Fant ikke noe nettverk – koble PC-en til mobil-hotspot eller Wi-Fi og start på nytt.')
  }
  console.log('\n  Ctrl+C avslutter.\n')
})
