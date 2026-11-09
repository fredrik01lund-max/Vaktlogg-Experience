import type { Hvem, Ordet, Scene } from './types.ts'

/** Rolig fremføringstempo på norsk (ca. 135 ord i minuttet). */
export const ORD_PER_SEK = 2.25
/** Hvor lenge vi venter på sensor. */
export const SENSOR_SEK = 10

export function ord(tekst?: string): number {
  if (!tekst) return 0
  return tekst.replace(/\[[^\]]*\]/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
}

/** Taletid ut fra antall ord. */
export function taletid(tekst?: string): number {
  return ord(tekst) / ORD_PER_SEK
}

/** Planlagte sekunder per takt: stille takter får animasjonstiden, sensor får sek (ellers SENSOR_SEK),
 *  og resten av scenens tid fordeles på taktene med tale etter hvor mye som sies. */
export function taktPlan(s: Scene): number[] {
  const fast = s.takter.map((t) => (t.hvem === 'stille' ? (t.auto ?? t.anim ?? 0) : t.hvem === 'sensor' ? (t.sek ?? SENSOR_SEK) : 0))
  const rest = Math.max(0, s.varighet - fast.reduce((a, b) => a + b, 0))
  const vekter = s.takter.map((t, i) => (fast[i] || t.hvem === 'stille' || t.hvem === 'sensor' ? 0 : Math.max(taletid(t.sier), t.sier ? 2 : 1)))
  const sum = vekter.reduce((a, b) => a + b, 0) || 1
  return s.takter.map((_, i) => fast[i] + (vekter[i] / sum) * rest)
}

/** Når hver scene skal starte (sekunder fra start). */
export function sceneStart(scener: Scene[]): number[] {
  let t = 0
  return scener.map((s) => {
    const start = t
    t += s.varighet
    return start
  })
}

/** Planlagt tidspunkt for en takt. */
export function planTid(scener: Scene[], scene: number, takt: number): number {
  const start = sceneStart(scener)[scene] ?? 0
  const plan = taktPlan(scener[scene])
  return start + plan.slice(0, takt).reduce((a, b) => a + b, 0)
}

export type Fordeling = Record<Hvem | 'stille' | 'sensor', number>

/** Planlagt tid per presentatør (takter med «alle» deles likt). */
export function fordeling(scener: Scene[]): Fordeling {
  const f: Fordeling = { A: 0, B: 0, C: 0, stille: 0, sensor: 0 }
  for (const s of scener) {
    taktPlan(s).forEach((sek, i) => {
      const h: Ordet = s.takter[i].hvem
      if (h === 'alle') for (const p of ['A', 'B', 'C'] as const) f[p] += sek / 3
      else f[h] += sek
    })
  }
  return f
}

/** Taletid ut fra manus per presentatør – for å se om manuset passer tiden. */
export function manusTid(scener: Scene[]): Record<Hvem, number> {
  const f: Record<Hvem, number> = { A: 0, B: 0, C: 0 }
  for (const s of scener) for (const t of s.takter) if (t.hvem === 'A' || t.hvem === 'B' || t.hvem === 'C') f[t.hvem] += taletid(t.sier)
  return f
}

export function mmss(sek: number): string {
  const neg = sek < 0
  const s = Math.round(Math.abs(sek))
  return `${neg ? '−' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
