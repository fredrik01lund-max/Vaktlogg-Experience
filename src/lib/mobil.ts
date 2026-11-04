// Sensors mobil: hvordan den når storskjermen, og om den er koblet til (vises i presentatørvisningen fra start).
//
//  - Eksamenstjeneren (npm run eksamen) svarer på speil-status: mobilen går via den over det lokale nettet,
//    uten internett. Mobilen åpner http://<IP>:8080/s.
//  - Ellers (GitHub Pages, fil, vite): reléet over internett (rele.ts). Mobilen åpner presentasjonens /s/ og
//    skriver inn romkoden fra presentatørvisningen. Koden lages én gang per PC og huskes, også av mobilen.
import { kobleRele, lagKode, vaskKode } from './rele.ts'
import { sendStatus } from './sync.ts'

export type Speilmodus = 'lokal' | 'rele'

/** Den publiserte presentasjonen: mobilen kan alltid åpne /s/ herfra, også når PC-en kjører fra fil. */
const OFFENTLIG = 'https://fredrik01lund-max.github.io/Vaktlogg-Experience/'
const NOKKEL = 'vaktlogg-experience:rom'

let modus: Promise<Speilmodus> | null = null
export function speilmodus(): Promise<Speilmodus> {
  modus ??=
    window.location.protocol.startsWith('http') && !window.location.hostname.endsWith('github.io')
      ? fetch('speil-status', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((j): Speilmodus => (j?.speil === true ? 'lokal' : 'rele'))
          .catch((): Speilmodus => 'rele')
      : Promise.resolve('rele')
  return modus
}

const minst4 = (k: string) => (k.length >= 4 ? k : '')
let kode: string | null = null
/** Romkoden for reléet. ?rom=<kode> på hovedskjermen setter den; ellers lages en ny første gang og huskes. */
export function romkode(): string {
  if (kode) return kode
  const fraUrl = minst4(vaskKode(new URLSearchParams(window.location.search).get('rom')))
  try {
    kode = fraUrl || minst4(vaskKode(localStorage.getItem(NOKKEL))) || lagKode()
    localStorage.setItem(NOKKEL, kode)
  } catch {
    kode = fraUrl || lagKode()
  }
  return kode
}

/** Adressen sensors mobil åpner (uten https://, så den er lett å skrive). */
export function mobilAdresse(): string {
  const base = window.location.hostname.endsWith('github.io') ? new URL('.', window.location.href).href : OFFENTLIG
  return base.replace(/^https?:\/\//, '') + 's'
}

/** Hovedskjermen følger med på mobilen hele tiden, så presentatørvisningen viser det før presentasjonen starter. */
let startet = false
export function startMobilvakt() {
  if (startet) return
  startet = true
  speilmodus().then((m) => {
    if (m === 'lokal') {
      const sjekk = () =>
        fetch('speil-status', { cache: 'no-store' })
          .then((r) => r.json())
          .then((j) => sendStatus({ mobil: Number(j?.mobiler ?? 0), mobilKode: null, rele: null }))
          .catch(() => sendStatus({ mobil: 0, mobilKode: null, rele: null }))
      sjekk()
      window.setInterval(sjekk, 2000)
      return
    }
    const k = romkode()
    let sistFraMobilen = 0
    // Alt mobilen sender teller som livstegn (pulsen hvert 3. sekund, tilstand, rulling …).
    // «hei» og «nullstill» kommer fra prototypen på storskjermen, ikke fra mobilen.
    const rele = kobleRele(k, { paMelding: (m) => m.type !== 'hei' && m.type !== 'nullstill' && (sistFraMobilen = Date.now()) })
    let forrige = ''
    const meld = () => {
      const s = { mobil: Date.now() - sistFraMobilen < 8000 ? 1 : 0, mobilKode: k, mobilAdresse: mobilAdresse(), rele: rele.apne() > 0 }
      const json = JSON.stringify(s)
      if (json === forrige) return
      forrige = json
      sendStatus(s)
    }
    meld()
    window.setInterval(meld, 1000)
  })
}
