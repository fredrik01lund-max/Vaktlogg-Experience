import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'

export type SceneProps = { takt: number; valg: number | null }

export const MYK = [0.22, 1, 0.36, 1] as const
export const FILM = [0.65, 0, 0.35, 1] as const

/** Kommer mykt inn (fra uskarphet) når «vis» er sann, og trekker seg ut igjen når den ikke er det. */
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
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x, filter: 'blur(10px)' }}
      animate={vis ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' } : { opacity: 0, y: -y * 0.4, x: 0, filter: 'blur(10px)' }}
      transition={{ duration: vis ? tid : 0.6, delay: vis ? d : 0, ease: MYK }}
    >
      {children}
    </motion.div>
  )
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
