// Sensors mobil: hvordan den når storskjermen, og om den er koblet til (vises i presentatørvisningen fra start).
//
//  - Eksamenstjeneren (npm run eksamen) svarer på speil-status: mobilen går via den over det lokale nettet,
//    uten internett. Mobilen åpner http://<IP>:8080/s.
//  - Ellers (GitHub Pages, fil, vite): reléet over internett (rele.ts). Mobilen åpner presentasjonens /s/ og
//    skriver inn romkoden fra presentatørvisningen. Koden lages én gang per PC og huskes, også av mobilen.
import { useSyncExternalStore } from 'react'
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

/** Det hovedskjermen vet om sensors mobil – vises på startskjermen og under H. */
export type MobilInfo = { modus: Speilmodus | null; kode: string | null; adresse: string; mobil: number; rele: boolean | null }
let info: MobilInfo = { modus: null, kode: null, adresse: '', mobil: 0, rele: null }
const infoLyttere = new Set<() => void>()
const settInfo = (ny: Partial<MobilInfo>) => {
  info = { ...info, ...ny }
  infoLyttere.forEach((f) => f())
}
export const useMobilInfo = () =>
  useSyncExternalStore(
    (f) => (infoLyttere.add(f), () => infoLyttere.delete(f)),
    () => info,
  )

/** Hovedskjermen følger med på mobilen hele tiden, så presentatørvisningen viser det før presentasjonen starter. */
let startet = false
export function startMobilvakt() {
  if (startet) return
  startet = true
  speilmodus().then((m) => {
    if (m === 'lokal') {
      settInfo({ modus: 'lokal' })
      const sjekk = () =>
        fetch('speil-status', { cache: 'no-store' })
          .then((r) => r.json())
          .then((j) => {
            const mobil = Number(j?.mobiler ?? 0)
            sendStatus({ mobil, mobilKode: null, rele: null })
            if (mobil !== info.mobil) settInfo({ mobil })
          })
          .catch(() => sendStatus({ mobil: 0, mobilKode: null, rele: null }))
      sjekk()
      window.setInterval(sjekk, 2000)
      return
    }
    const k = romkode()
    let sistFraMobilen = 0
    // Alt mobilen sender teller som livstegn (pulsen hvert 3. sekund, tilstand, rulling …).
    // «hei», «nullstill» og «skjerm» kommer fra storskjermen (prototypen og presentasjonen), ikke fra mobilen.
    const rele = kobleRele(k, { paMelding: (m) => !['hei', 'nullstill', 'skjerm'].includes(m.type) && (sistFraMobilen = Date.now()) })
    // Presentasjonen sier fra om seg selv, så mobilen kan vise om den har funnet storskjermen (riktig kode)
    window.setInterval(() => rele.send({ type: 'skjerm' }), 3000)
    let forrige = ''
    const t0 = Date.now()
    const meld = () => {
      // rele: null de første sekundene mens den kobler til (ikke meld feil før det er en feil)
      const releOk = rele.apne() > 0 ? true : Date.now() - t0 < 6000 ? null : false
      const s = { mobil: Date.now() - sistFraMobilen < 8000 ? 1 : 0, mobilKode: k, mobilAdresse: mobilAdresse(), rele: releOk }
      const json = JSON.stringify(s)
      if (json === forrige) return
      forrige = json
      sendStatus(s)
      settInfo({ modus: 'rele', kode: k, adresse: s.mobilAdresse, mobil: s.mobil, rele: s.rele })
    }
    meld()
    window.setInterval(meld, 1000)
  })
}
