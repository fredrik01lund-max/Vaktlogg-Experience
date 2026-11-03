import { useSyncExternalStore } from 'react'
import { manus } from '../content/manus.ts'

// Felles tilstand for hovedskjermen og presentatørvinduet. Begge kan styre (klikker, tastatur,
// knapper), og den nyeste endringen vinner. Meldingene går via BroadcastChannel og i tillegg
// via window.opener/postMessage, så det også virker når presentasjonen åpnes fra fil.

export type Tilstand = {
  /** Øker for hver endring – den høyeste vinner. */
  v: number
  startet: boolean
  /** Tidspunkt (ms) presentasjonen startet. */
  start: number | null
  scene: number
  takt: number
  /** Tidspunkt (ms) nåværende takt startet. */
  taktFra: number
  sceneFra: number
  /** Sensors valg i designvalget (1–4). */
  valg: number | null
  svart: boolean
  /** Økes for å laste prototypen på nytt med rene data. */
  demoNr: number
}

export type Status = { film: 'laster' | 'klar' | 'feil'; demo: string; sist: number }

type Melding =
  | { type: 'tilstand'; t: Tilstand; fra: string }
  | { type: 'hei'; fra: string }
  | { type: 'status'; s: Omit<Status, 'sist'>; fra: string }

const ID = Math.random().toString(36).slice(2)
// Lagret tilstand hører til én bestemt scenerekkefølge: endres manus (scener eller antall takter),
// blir en gammel posisjon forkastet i stedet for å peke på en takt som ikke finnes – det ga svart side.
const SIGNATUR = manus.map((s) => `${s.id}:${s.takter.length}`).join(',')
const LAGRET = `vaktlogg-experience:tilstand:${[...SIGNATUR].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36)}`

const ny = (): Tilstand => ({ v: 0, startet: false, start: null, scene: 0, takt: 0, taktFra: Date.now(), sceneFra: Date.now(), valg: null, svart: false, demoNr: 0 })

/** Peker tilstanden på en scene og takt som finnes i dette manuset? */
const gyldig = (t: Tilstand | null): t is Tilstand =>
  !!t && Number.isInteger(t.scene) && Number.isInteger(t.takt) && t.scene >= 0 && t.scene < manus.length && t.takt >= 0 && t.takt < manus[t.scene].takter.length

function lesLagret(): Tilstand {
  try {
    // Rydd bort posisjoner lagret av eldre versjoner av presentasjonen
    for (const k of Object.keys(localStorage)) if (k.startsWith('vaktlogg-experience:tilstand') && k !== LAGRET) localStorage.removeItem(k)
    const t = JSON.parse(localStorage.getItem(LAGRET) || 'null') as Tilstand | null
    // Gjenopprett bare en pågående fremføring fra de siste tre timene – og aldri med svart skjerm
    if (gyldig(t) && t.start && Date.now() - t.start < 3 * 3600_000) return { ...t, svart: false }
  } catch {
    /* ingen lagring tilgjengelig */
  }
  return ny()
}

let tilstand: Tilstand = lesLagret()
let status: Status = { film: 'laster', demo: '', sist: 0 }
const lyttere = new Set<() => void>()
const varsle = () => lyttere.forEach((f) => f())

let kanal: BroadcastChannel | null = null
try {
  kanal = new BroadcastChannel('vaktlogg-experience')
} catch {
  kanal = null
}
const vinduer = new Set<Window>()

function send(m: Melding) {
  kanal?.postMessage(m)
  const andre = new Set(vinduer)
  if (window.opener && !window.opener.closed) andre.add(window.opener)
  for (const w of andre) {
    try {
      if (!w.closed) w.postMessage({ vaktloggExperience: m }, '*')
    } catch {
      /* vinduet er borte */
    }
  }
}

function motta(m: Melding) {
  if (!m || m.fra === ID) return
  // Et vindu med en eldre versjon av presentasjonen kan sende en posisjon som ikke finnes her – den hoppes over
  if (m.type === 'tilstand' && m.t.v > tilstand.v && gyldig(m.t)) {
    tilstand = m.t
    lagre()
    varsle()
  } else if (m.type === 'hei') {
    send({ type: 'tilstand', t: tilstand, fra: ID })
    // Hovedskjermen svarer også med status, så et nytt presentatørvindu ser den med en gang
    if (minStatus) send({ type: 'status', s: minStatus, fra: ID })
  } else if (m.type === 'status') {
    status = { ...m.s, sist: Date.now() }
    varsle()
  }
}

if (kanal) kanal.onmessage = (e) => motta(e.data as Melding)
window.addEventListener('message', (e) => {
  const m = (e.data as { vaktloggExperience?: Melding } | null)?.vaktloggExperience
  if (!m) return
  if (e.source && e.source !== window) vinduer.add(e.source as Window)
  motta(m)
})
send({ type: 'hei', fra: ID })

function lagre() {
  try {
    localStorage.setItem(LAGRET, JSON.stringify(tilstand))
  } catch {
    /* ikke viktig */
  }
}

export function sett(endring: Partial<Tilstand>) {
  tilstand = { ...tilstand, ...endring, v: Math.max(tilstand.v, Date.now()) + 1 }
  lagre()
  varsle()
  send({ type: 'tilstand', t: tilstand, fra: ID })
}

let minStatus: Omit<Status, 'sist'> | null = null
export function sendStatus(s: Omit<Status, 'sist'>) {
  minStatus = s
  send({ type: 'status', s, fra: ID })
}

export function useTilstand(): Tilstand {
  return useSyncExternalStore(
    (f) => (lyttere.add(f), () => lyttere.delete(f)),
    () => tilstand,
  )
}

export function useStatus(): Status {
  return useSyncExternalStore(
    (f) => (lyttere.add(f), () => lyttere.delete(f)),
    () => status,
  )
}

export const hent = () => tilstand

// ── Navigasjon ──────────────────────────────────────────────────────────────

export function gaTil(scene: number, takt = 0) {
  const s = Math.max(0, Math.min(manus.length - 1, scene))
  const k = Math.max(0, Math.min(manus[s].takter.length - 1, takt))
  const naa = Date.now()
  sett({ scene: s, takt: k, taktFra: naa, sceneFra: s === tilstand.scene ? tilstand.sceneFra : naa, svart: false })
}

export function start() {
  const naa = Date.now()
  sett({ startet: true, start: naa, scene: 0, takt: 0, taktFra: naa, sceneFra: naa, valg: null, svart: false, demoNr: tilstand.demoNr + 1 })
}

export function neste() {
  const t = tilstand
  if (!t.startet) return start()
  const s = manus[t.scene]
  if (t.takt < s.takter.length - 1) gaTil(t.scene, t.takt + 1)
  else if (t.scene < manus.length - 1) gaTil(t.scene + 1, 0)
}

export function forrige() {
  const t = tilstand
  if (!t.startet) return
  if (t.takt > 0) gaTil(t.scene, t.takt - 1)
  else if (t.scene > 0) gaTil(t.scene - 1, manus[t.scene - 1].takter.length - 1)
}

/** Sensors valg i designvalget (scenen er lagt til side – da gjør dette ingenting). */
export function velg(n: number) {
  const i = manus.findIndex((s) => s.id === 'sensor')
  if (i < 0) return
  sett({ valg: n })
  gaTil(i, manus[i].takter.length - 1)
}

export function nullstill() {
  sett({ ...ny(), demoNr: tilstand.demoNr + 1 })
}

export function svart(av?: boolean) {
  sett({ svart: av ?? !tilstand.svart })
}

export function nyDemo() {
  sett({ demoNr: tilstand.demoNr + 1 })
}

/** Åpner presentatørvinduet (eller hovedskjermen fra presentatørvinduet). */
export function apneVindu(vis: 'presentator' | 'hoved') {
  const url = new URL(window.location.href)
  url.hash = ''
  if (vis === 'hoved') url.searchParams.delete('vis')
  else url.searchParams.set('vis', vis)
  const w = window.open(url.toString(), vis === 'hoved' ? 'vaktlogg-hoved' : 'vaktlogg-presentator', vis === 'hoved' ? '' : 'popup,width=1280,height=800')
  if (w) {
    vinduer.add(w)
    // Det nye vinduet sier hei når det er klart; send tilstanden også etter litt for sikkerhets skyld
    setTimeout(() => send({ type: 'tilstand', t: tilstand, fra: ID }), 1200)
  }
  return w
}
