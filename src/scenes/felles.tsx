import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'

export type SceneProps = { takt: number; valg: number | null }

export const MYK = [0.22, 1, 0.36, 1] as const
export const FILM = [0.65, 0, 0.35, 1] as const

/** Kommer inn når «vis» er sann, og trekker seg ut igjen når den ikke er det. Bevisst enkelt: en kort
 *  forflytning og en toning – ingen uskarphet (blur-inn på alt er et av de tydeligste mal-sporene). */
export function Inn({
  vis = true,
  d = 0,
  y = 26,
  x = 0,
  tid = 1.1,
  className,
  style,
  children,
}: {
  vis?: boolean
  d?: number
  y?: number
  x?: number
  tid?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const dy = Math.sign(y) * Math.min(Math.abs(y), 10)
  const dx = Math.sign(x) * Math.min(Math.abs(x), 14)
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: dy, x: dx }}
      animate={vis ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 0, x: 0 }}
      transition={{ duration: vis ? Math.min(tid, 0.55) : 0.3, delay: vis ? d * 0.8 : 0, ease: MYK }}
    >
      {children}
    </motion.div>
  )
}

/** Vakt for filmene: står en film stille i 3 sekunder mens den skal gå (skjult vindu, dekoder som henger),
 *  kalles stoppet() – så presentasjonen aldri blir stående uten at noen vet at de skal klikke. */
export function useFilmVakt(video: { current: HTMLVideoElement | null }, aktiv: boolean, stoppet: () => void) {
  useEffect(() => {
    const v = video.current
    if (!v || !aktiv) return
    let sist = -1
    let stille = 0
    const id = window.setInterval(() => {
      if (v.ended) return
      stille = v.currentTime === sist ? stille + 1 : 0
      sist = v.currentTime
      if (stille >= 6) {
        clearInterval(id)
        stoppet()
      }
    }, 500)
    return () => clearInterval(id)
  }, [aktiv])
}

/** Sekunder siden komponenten kom på skjermen (oppdateres 20 ganger i sekundet). */
export function useSek(aktiv = true): number {
  const [sek, setSek] = useState(0)
  useEffect(() => {
    if (!aktiv) return
    const t0 = performance.now()
    const id = window.setInterval(() => setSek((performance.now() - t0) / 1000), 50)
    return () => clearInterval(id)
  }, [aktiv])
  return sek
}

// ── Felles bakgrunnslys (bokeh) – hver scene sier hvor sterkt det skal være ──
let lysNivaa = 0.5
const lysLyttere = new Set<() => void>()
export function settLys(n: number) {
  if (n === lysNivaa) return
  lysNivaa = n
  lysLyttere.forEach((f) => f())
}
export function useLysNivaa() {
  return useSyncExternalStore(
    (f) => (lysLyttere.add(f), () => lysLyttere.delete(f)),
    () => lysNivaa,
  )
}
/** Sett bakgrunnslyset mens scenen vises. */
export function useLys(n: number) {
  useEffect(() => settLys(n), [n])
}
