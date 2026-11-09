import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Stopp } from '../content/types.ts'
import ikon from '../lib/ikon.json'
import { useIkonSkjult } from '../scenes/felles.tsx'

/* ══ Diamant-ikonet (double diamond) ═════════════════════════════════════════════════════
   Ferdigrendret i Blender (blender/hopping_spor.py, stegene ikon-*), med gjennomsiktig bakgrunn. Står øverst til
   høyre på hver scene og viser hvor i Design Thinking-prosessen vi er: feltet vi er i, lyser, og kula ligger der.
   Når fasen skifter ett steg fremover, spilles en kort animasjon (1,6 s) der kula glir dit – ellers vises stillbildet.
   Siste bilde i animasjonen er det samme som stillbildet. Ingen tekst i bildet – fasenavnet står under. */

// Ved startpunktet (del 1) sier ikonet hva det er; deretter står fasen der kula er
const NAVN: Partial<Record<Stopp, string>> = { start: 'Design Thinking', empathize: 'Empathize', define: 'Define', ideate: 'Ideate', prototype: 'Prototype', test: 'Test' }
const bilde = (s: Stopp) => (ikon.stopp as Record<string, string>)[s]
const overgang = (fra: Stopp | null, til: Stopp) => (fra ? ikon.overganger.find((o) => o.fra === fra && o.til === til) : undefined)

export function forhandslastIkon() {
  for (const b of Object.values(ikon.stopp)) new Image().src = b
  for (const o of ikon.overganger) {
    const v = document.createElement('video')
    v.preload = 'auto'
    v.muted = true
    v.src = o.film
  }
}

/** utenNavn: fasenavnet under ikonet skjules (brukerreisen har sine egne faser nederst, og høyst 8 ord samtidig). */
export function Diamant({ stopp, utenNavn = false }: { stopp: Stopp | null; utenNavn?: boolean }) {
  const forrige = useRef<Stopp | null>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [film, setFilm] = useState<string | null>(null)
  // Fasenavnet som står under ikonet. Ved en overgang byttes det først når kula har kommet frem.
  const [vist, setVist] = useState<Stopp | null>(stopp)
  const skjult = useIkonSkjult()
  const ferdig = () => {
    setFilm(null)
    setVist(stopp)
  }

  useEffect(() => {
    const fra = forrige.current
    forrige.current = stopp
    if (!stopp) return
    const o = overgang(fra, stopp)
    setFilm(o ? o.film : null)
    if (!o) setVist(stopp)
  }, [stopp])

  useEffect(() => {
    const v = video.current
    if (!film || !v) return
    v.currentTime = 0
    v.play().catch(ferdig)
  }, [film])

  if (!stopp) return null
  const navn = vist ? NAVN[vist] : undefined
  return (
    <motion.div className="diamant-ikon" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: skjult ? 0 : 1 }} transition={{ duration: skjult ? 0 : 0.6 }}>
      <img src={bilde(stopp)} alt="" style={{ opacity: film ? 0 : 1 }} />
      {film && <video ref={video} src={film} muted playsInline onEnded={ferdig} onError={ferdig} />}
      <AnimatePresence>
        {navn && !utenNavn && !film && (
          <motion.div key={vist} className="diamant-navn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            {navn}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
