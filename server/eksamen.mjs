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
// Den frosne kopien (dist-eksamen-trygg) går foran et ferskt bygg: på eksamensdagen skal det som er øvd på, kjøres
const MAPPE = [process.argv[2], 'dist-eksamen-trygg', 'dist-eksamen', 'dist'].filter(Boolean).map((m) => path.resolve(ROT, m)).find((m) => fs.existsSync(path.join(m, 'index.html')))
if (!MAPPE) {
  console.error('Fant ingen bygget presentasjon. Kjør først: npm run build:eksamen')
  process.exit(1)
}
if (!process.argv[2] && path.basename(MAPPE) === 'dist') {
  console.warn('\n  ⚠ Fant ikke dist-eksamen – bruker dist/ (den offentlige versjonen). Kjør npm run build:eksamen.')
}
const bygget = (m) => fs.statSync(path.join(m, 'index.html')).mtime
if (path.basename(MAPPE) === 'dist-eksamen-trygg' && fs.existsSync(path.join(ROT, 'dist-eksamen', 'index.html')) && bygget(path.join(ROT, 'dist-eksamen')) > bygget(MAPPE)) {
  console.warn('\n  ⚠ dist-eksamen er nyere enn den frosne kopien. Vil dere bruke det nye bygget: node server/eksamen.mjs dist-eksamen')
}
// Filene scenene trenger – mangler noe, skal det sies nå og ikke midt i fremføringen
const TRENGS = ['film/apning2.mp4', 'film/apning2-slutt.png', 'film/apning2-frys.png', 'film/pakket.mp4', 'film/telefon.mp4', 'film/telefon-slutt.png', 'film/hopping2.mp4', 'film/hopping2-slutt.png', 'film/maned-anim.webm', 'demo/vaktlogg.html', ...['0', '1-duell', '1-makker', '1-laget', '1-rolig', '2', '3', '4', '5', '6'].map((i) => `demo/domeo/sensor-${i}.mp3`), ...['salg', 'helse', 'live', 'rapport', 'sjef', 'start', 'domeo', 'tilbakemelding-skjema'].map((n) => `skjerm/${n}.png`),
  // Manus v2: filmene, stillbildene og diamant-ikonet
  ...['ringer2.mp4', 'kassa2.mp4', 'intervju2.mp4', 'reise2.mp4', 'kilder2.mp4', 'kilder2-slutt.png', 'kassa2-sammenlign.png'].map((f) => `film/${f}`), 'qr-prototype.svg',
  ...['start', 'empathize', 'define', 'ideate', 'prototype', 'test', 'helhet'].map((s) => `film/ikon-${s}.png`), ...[1, 2, 3, 4, 5, 6].map((i) => `film/ikon-${i}.webm`)]
const mangler = TRENGS.filter((f) => !fs.existsSync(path.join(MAPPE, f)))
if (mangler.length) console.warn('\n  ⚠ Mangler i ' + path.basename(MAPPE) + ': ' + mangler.join(', '))

// En feil i én forespørsel skal aldri stoppe tjeneren midt i fremføringen
process.on('uncaughtException', (e) => console.error('  Feil (tjeneren kjører videre):', e?.message ?? e))
process.on('unhandledRejection', (e) => console.error('  Feil (tjeneren kjører videre):', e?.message ?? e))

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
  // Kort adresse til sensors mobil (skrives for hånd): /s
  if (url.pathname === '/s') {
    res.writeHead(302, { location: '/demo/vaktlogg.html?sensor&speil=send' }).end()
    return
  }
  if (url.pathname === '/speil-status') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
    res.end(JSON.stringify({ speil: true, mobiler: sendere() }))
    return
  }
  let sti
  try {
    sti = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400).end()
    return
  }
  let fil = path.normalize(path.join(MAPPE, sti))
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
      fs.createReadStream(fil, { start, end: slutt })
        .on('error', () => res.destroy())
        .pipe(res)
      return
    }
    res.writeHead(200, { 'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes', 'cache-control': 'no-cache' })
    fs.createReadStream(fil)
      .on('error', () => res.destroy())
      .pipe(res)
  })
})

// Videresending: alt én klient sender, går til alle de andre
const wss = new WebSocketServer({ server: tjener, path: '/speil' })
const rolle = new Map()
const sendere = () => [...rolle.values()].filter((r) => r === 'send').length
wss.on('connection', (ws, req) => {
  const fra = req.socket.remoteAddress?.replace('::ffff:', '') ?? '?'
  rolle.set(ws, 'ukjent')
  // Be klienten melde seg: mobilen svarer med tilstanden sin, så den blir registrert og storskjermen synkes straks
  // (ellers står den som frakoblet etter dvale til sensor trykker på noe)
  try {
    ws.send(JSON.stringify({ type: 'hei' }))
  } catch {}
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

/** IPv4-adressene med navnet på nettverkskortet, så det er lett å velge riktig (Wi-Fi/hotspot, ikke VPN eller WSL). */
function adresser() {
  return Object.entries(os.networkInterfaces()).flatMap(([navn, liste]) =>
    (liste ?? []).filter((a) => a.family === 'IPv4' && !a.internal).map((a) => ({ navn, adresse: a.address })),
  )
}

tjener.on('error', (e) => {
  console.error(e.code === 'EADDRINUSE' ? `\n  Port ${PORT} er opptatt – en annen eksamenstjener kjører trolig allerede. Lukk den (Ctrl+C i det vinduet) og start på nytt.\n` : e)
  process.exit(1)
})
tjener.listen(PORT, '0.0.0.0', () => {
  const ip = adresser()
  console.log(`\nVaktlogg Experience – eksamen (${path.relative(ROT, MAPPE)}, bygget ${bygget(MAPPE).toLocaleString('nb-NO')})\n`)
  console.log(`  Storskjermen:  http://localhost:${PORT}/`)
  if (ip.length) {
    console.log(`  Sensor-mobilen (samme nett som PC-en):`)
    for (const a of ip) console.log(`                 http://${a.adresse}:${PORT}/s   (${a.navn})`)
    console.log('  Bruk adressen på kortet mobilen er koblet til (Wi-Fi / hotspot). Spør Windows om brannmuren:')
    console.log('  tillat Node på både private og offentlige nett – en hotspot blir ofte regnet som offentlig.')
  } else {
    console.log('  Fant ikke noe nettverk – koble PC-en til mobil-hotspot eller Wi-Fi og start på nytt.')
  }
  console.log('\n  Ctrl+C avslutter.\n')
})
