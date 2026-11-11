import { manus } from '../content/manus.ts'
import { hent, neste } from './sync.ts'

// Tastene til spillet i «Veien videre» (forretningsmodellen, public/spill/index.html).
// Mens spillet vises, styrer piltastene, A/D/W og mellomrom figurene i stedet for å bla, og PageDown/Enter sender
// figurene til neste stopp. Når det ikke er flere stopp, sier spillet fra, og presentasjonen går videre som vanlig.
// Tastene sendes på en egen kanal, så de virker både fra hovedskjermen og fra presentatørvinduet.

type Melding = { spill: 'tast'; tast: 'v' | 'h' | 'hopp'; ned: boolean } | { spill: 'neste' }

const kanal = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('vaktlogg-experience:spill') : null
let mottaker: ((m: Melding) => void) | null = null

/** Spillet er fremme: scenen «videre», første klikk. */
export function spillAktivt() {
  const t = hent()
  return t.startet && manus[t.scene]?.id === 'videre' && t.takt === 0
}

function send(m: Melding) {
  mottaker?.(m)
  kanal?.postMessage(m)
}

/** Hovedskjermen (der spillet står) tar imot tastene. Returnerer en funksjon som kobler fra. */
export function taImotSpilltaster(f: (m: Melding) => void) {
  mottaker = f
  const lytt = (e: MessageEvent) => f(e.data as Melding)
  kanal?.addEventListener('message', lytt)
  return () => {
    mottaker = null
    kanal?.removeEventListener('message', lytt)
  }
}

/** Spillet sier fra at det ikke er flere stopp: gå videre i presentasjonen. */
export function spillFerdig() {
  if (spillAktivt()) neste()
}

function tastFor(k: string): 'v' | 'h' | 'hopp' | null {
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') return 'v'
  if (k === 'ArrowRight' || k === 'd' || k === 'D') return 'h'
  if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') return 'hopp'
  return null
}

let koblet = false
/** Kalles én gang i hvert vindu (hovedskjerm og presentatør). Fanger tastene før vanlig blaing. */
export function brukSpilltaster() {
  if (koblet || typeof window === 'undefined') return
  koblet = true
  const fang = (e: KeyboardEvent, ned: boolean) => {
    if (e.altKey || e.ctrlKey || e.metaKey || !spillAktivt()) return
    const t = tastFor(e.key)
    const videre = e.key === 'PageDown' || e.key === 'Enter' || e.key === 'ArrowDown'
    if (!t && !videre) return
    e.preventDefault()
    e.stopImmediatePropagation()
    if (t) send({ spill: 'tast', tast: t, ned })
    else if (ned && !e.repeat) send({ spill: 'neste' })
  }
  window.addEventListener('keydown', (e) => fang(e, true), true)
  window.addEventListener('keyup', (e) => fang(e, false), true)
}
