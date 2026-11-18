import { useSyncExternalStore } from 'react'

// Bildekvalitet: «full» (alt som før) eller «lett» for eldre maskiner.
//
// Lett modus endrer ikke innholdet, bare det som koster mest å tegne: filmene spilles i 720p (film/lett/,
// en seksdel så store), de små kamerabevegelsene i fotografiene slås av, og uskarphet bak paneler tas bort.
// Maskiner med god ytelse merker ingenting – de får full kvalitet.
//
// Valget:
//   • «auto» (standard): lett hvis maskinen ser svak ut ved oppstart (få prosessorkjerner eller lite minne),
//     eller hvis bildefrekvensen faller og blir liggende lavt mens presentasjonen går (maalYtelse).
//   • «full» eller «lett»: valgt for hånd på startskjermen eller med K. Da overstyres auto. Valget huskes.
//   • ?kvalitet=lett | full | auto i adressen gjør det samme (og huskes).

export type Valg = 'auto' | 'full' | 'lett'
const NOKKEL = 'vaktlogg-experience:kvalitet'

function lesValg(): Valg {
  try {
    const q = new URLSearchParams(window.location.search).get('kvalitet')
    if (q === 'lett' || q === 'full' || q === 'auto') {
      localStorage.setItem(NOKKEL, q)
      return q
    }
    const l = localStorage.getItem(NOKKEL)
    if (l === 'lett' || l === 'full') return l
  } catch {
    /* uten lagring: auto */
  }
  return 'auto'
}

/** Ser maskinen svak ut? Få kjerner (eldre tokjerners bærbare melder 4 eller færre) eller lite minne (bare Chrome/Edge sier det). */
function svakMaskin(): boolean {
  const n = navigator as Navigator & { deviceMemory?: number }
  const kjerner = n.hardwareConcurrency || 8
  return kjerner <= 4 || (typeof n.deviceMemory === 'number' && n.deviceMemory <= 4)
}

let valg: Valg = typeof window !== 'undefined' ? lesValg() : 'auto'
// Auto bestemmer seg ved oppstart, og kan bare gå ned til lett underveis (aldri hoppe frem og tilbake)
let autoLett = typeof window !== 'undefined' ? svakMaskin() : false
const lyttere = new Set<() => void>()
const si = () => lyttere.forEach((f) => f())

export const erLett = () => (valg === 'auto' ? autoLett : valg === 'lett')
export const kvalitetValg = () => valg

export function settKvalitet(v: Valg) {
  valg = v
  try {
    if (v === 'auto') localStorage.removeItem(NOKKEL)
    else localStorage.setItem(NOKKEL, v)
  } catch {
    /* ikke viktig */
  }
  si()
}
/** K på tastaturet, eller knappen på startskjermen: auto → lett → full → auto. */
export function nesteKvalitet() {
  settKvalitet(valg === 'auto' ? 'lett' : valg === 'lett' ? 'full' : 'auto')
}

const abonner = (f: () => void) => (lyttere.add(f), () => void lyttere.delete(f))
export const useLett = () => useSyncExternalStore(abonner, erLett)
export const useKvalitetValg = () => useSyncExternalStore(abonner, kvalitetValg)
export const paKvalitet = abonner

/** Følger med på bildefrekvensen. Blir den liggende under 24 bilder i sekundet i fem sekunder (mens siden er
 *  synlig og valget står på auto), går presentasjonen over til lett modus. Returnerer en funksjon som stopper. */
export function maalYtelse(): () => void {
  if (typeof window === 'undefined') return () => {}
  let id = 0
  let forrige = performance.now()
  let vindu = forrige
  let bilder = 0
  let trege = 0
  const tikk = (naa: number) => {
    id = requestAnimationFrame(tikk)
    const d = naa - forrige
    forrige = naa
    // Fanen har vært skjult, eller maskinen har sovet: start målingen på nytt
    if (d > 1000 || document.visibilityState !== 'visible') {
      vindu = naa
      bilder = 0
      trege = 0
      return
    }
    bilder++
    if (naa - vindu < 1000) return
    const fps = (bilder * 1000) / (naa - vindu)
    vindu = naa
    bilder = 0
    trege = fps < 24 ? trege + 1 : 0
    if (trege >= 5 && valg === 'auto' && !autoLett) {
      autoLett = true
      si()
    }
  }
  id = requestAnimationFrame(tikk)
  return () => cancelAnimationFrame(id)
}
