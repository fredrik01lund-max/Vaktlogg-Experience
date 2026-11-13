import { useEffect, useRef, useState } from 'react'
import { lasOppLyd } from '../lib/lyd.ts'
import { spillAktivt, spillNeste } from '../lib/spill.ts'
import { forrige, neste } from '../lib/sync.ts'

/* ══ Berøringsskjerm (iPad og iPhone) ═══════════════════════════════════════════════════
   Uten tastatur og klikker: sveip mot venstre = neste, mot høyre = forrige, og en liten knapperad nederst
   (forrige · oversikt · neste) som blir tydelig når man rører skjermen og blekner til svak etter noen sekunder.
   I spillet (Veien videre) sender «neste» figurene til neste stopp, som PageDown.
   Står en iPhone på høykant, kommer et lite hint om å snu den (lerretet er 16:9).
   Vises bare på enheter med berøringsskjerm; på PC-en er alt som før. */

export const BEROERING =
  typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 1)

function fram() {
  if (spillAktivt()) spillNeste()
  else neste()
}

// Sveip som starter her, er ikke blaing (knapper, oversikten, hjelpen)
const IKKE_SVEIP = '.bt-rad, .oversikt, .hjelp, button, a, input, textarea'

export function Beroring({ onOversikt }: { onOversikt: () => void }) {
  const [synlig, setSynlig] = useState(true)
  const [hoykant, setHoykant] = useState(false)
  const ur = useRef(0)

  useEffect(() => {
    if (!BEROERING) return
    const vis = () => {
      setSynlig(true)
      window.clearTimeout(ur.current)
      ur.current = window.setTimeout(() => setSynlig(false), 3500)
    }
    vis()
    let fra: { x: number; y: number; t: number } | null = null
    const start = (e: TouchEvent) => {
      lasOppLyd()
      vis()
      const m = e.target as Element | null
      fra = e.touches.length === 1 && !m?.closest?.(IKKE_SVEIP) ? { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() } : null
    }
    const slutt = (e: TouchEvent) => {
      if (!fra) return
      const p = e.changedTouches[0]
      const dx = p.clientX - fra.x
      const dy = p.clientY - fra.y
      const raskt = Date.now() - fra.t < 800
      fra = null
      if (!raskt || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return
      if (dx < 0) fram()
      else forrige()
    }
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchend', slutt, { passive: true })
    return () => {
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchend', slutt)
      window.clearTimeout(ur.current)
    }
  }, [])

  useEffect(() => {
    if (!BEROERING) return
    const sjekk = () => setHoykant(window.innerHeight > window.innerWidth && Math.min(window.innerWidth, window.innerHeight) < 600)
    sjekk()
    window.addEventListener('resize', sjekk)
    return () => window.removeEventListener('resize', sjekk)
  }, [])

  if (!BEROERING) return null
  const trykk = (f: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    f()
  }
  return (
    <>
      {hoykant && <div className="bt-snu">Snu mobilen for større bilde</div>}
      <nav className={`bt-rad ${synlig ? '' : 'skjult'}`} aria-label="Bla i presentasjonen">
        <button aria-label="Forrige" onClick={trykk(forrige)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button aria-label="Oversikt over delene" onClick={trykk(onOversikt)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>
        <button className="bt-neste" aria-label="Neste" onClick={trykk(fram)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </>
  )
}
