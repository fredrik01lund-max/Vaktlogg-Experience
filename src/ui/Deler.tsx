import { useEffect, useId, useState, type CSSProperties } from 'react'

// Små byggeklosser som går igjen i flere scener.

/** Vaktlogg-merket: ring nesten rundt (vakten), prikk (nå) og V. Samme geometri som appikonet. */
export function Merke({ storrelse = 120, flate = true, style }: { storrelse?: number; flate?: boolean; style?: CSSProperties }) {
  const id = useId()
  return (
    <svg viewBox="0 0 512 512" width={storrelse} height={storrelse} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC896" />
          <stop offset="0.55" stopColor="#FDB8B4" />
          <stop offset="1" stopColor="#F6A2C8" />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A63F69" />
          <stop offset="1" stopColor="#6E2A3C" />
        </linearGradient>
      </defs>
      {flate && <rect width="512" height="512" rx="128" fill={`url(#${id}b)`} />}
      <circle cx="256" cy="256" r="168" fill="none" stroke="#fff" strokeOpacity="0.38" strokeWidth="40" />
      <path d="M393.6 352.4A168 168 0 1 1 374.8 137.2" fill="none" stroke="#fff" strokeWidth="40" strokeLinecap="round" />
      <circle cx="374.8" cy="137.2" r="30" fill="#fff" />
      <circle cx="374.8" cy="137.2" r="14" fill="#F59A6E" />
      <path d="M186 200L256 326L326 200" fill="none" stroke={`url(#${id}v)`} strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TEGN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ'

/** Flippbokstaver (som en gammel avgangstavle): fra ett ord til et annet, bokstav for bokstav. */
export function Flipp({ fra, til, start, className = '' }: { fra: string; til: string; start: boolean; className?: string }) {
  const lengde = Math.max(fra.length, til.length)
  const [tegn, setTegn] = useState(() => fra.padEnd(lengde).split(''))
  // Teller per celle: ny nøkkel for hvert blad, så vippeanimasjonen spilles på nytt
  const [blad, setBlad] = useState<number[]>(() => Array(lengde).fill(0))

  useEffect(() => {
    if (!start) {
      setTegn(fra.padEnd(lengde).split(''))
      setBlad(Array(lengde).fill(0))
      return
    }
    const tidtakere: number[] = []
    const malTegn = til.padEnd(lengde).split('')
    malTegn.forEach((mal, i) => {
      // Hver bokstav blar gjennom noen tegn før den lander – venstre først
      const runder = 7 + i * 2
      for (let r = 0; r <= runder; r++) {
        tidtakere.push(
          window.setTimeout(() => {
            setTegn((t) => {
              const n = [...t]
              n[i] = r === runder ? mal : TEGN[(TEGN.indexOf(t[i]) + 1 + r * 3) % TEGN.length] || 'A'
              return n
            })
            setBlad((b) => b.map((n, j) => (j === i ? n + 1 : n)))
          }, 260 + i * 120 + r * 70),
        )
      }
    })
    return () => tidtakere.forEach(clearTimeout)
  }, [start, fra, til, lengde])

  return (
    // data-ord: npm run sjekk-tekst teller ordet på tavla (ikke hver bokstav), og ikke mens bokstavene blar
    <div className={`flipp ${className}`} aria-label={start ? til : fra} data-ord={!start || tegn.join('') === til.padEnd(lengde) ? tegn.join('').trim() : ''}>
      {tegn.map((c, i) => (
        <span key={i} className="flipp-celle">
          <span key={blad[i]} className={`flipp-tegn ${blad[i] ? 'blar' : ''}`}>
            {c}
          </span>
        </span>
      ))}
    </div>
  )
}

export type BongData = { bord: string; pax?: string; linjer: string[]; tid: string; merk?: string }

/** En kjøkkenbong. */
export function Bong({ b, className = '', style }: { b: BongData; className?: string; style?: CSSProperties }) {
  return (
    <div className={`bong ${className}`} style={style}>
      <div className="bong-topp">
        <b>{b.bord}</b>
        <span>{b.tid}</span>
      </div>
      {b.pax && <div className="bong-pax">{b.pax}</div>}
      <div className="bong-strek" />
      {b.linjer.map((l, i) => (
        <div key={i} className="bong-linje">
          {l}
        </div>
      ))}
      {b.merk && <div className="bong-merk">{b.merk}</div>}
      <div className="bong-tagg" />
    </div>
  )
}

/** Klokke som teller fra ett tidspunkt til et annet (minutter siden midnatt). */
export function Klokke({ fra, til, sek, start, className = '' }: { fra: number; til: number; sek: number; start: boolean; className?: string }) {
  const [min, setMin] = useState(fra)
  useEffect(() => {
    if (!start) {
      setMin(fra)
      return
    }
    const t0 = performance.now()
    let id = 0
    const tikk = (naa: number) => {
      const p = Math.min(1, (naa - t0) / (sek * 1000))
      // Akselererer, så det føles som en vakt som tar av
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      setMin(Math.round(fra + (til - fra) * e))
      if (p < 1) id = requestAnimationFrame(tikk)
    }
    id = requestAnimationFrame(tikk)
    return () => cancelAnimationFrame(id)
  }, [start, fra, til, sek])
  const h = Math.floor(min / 60) % 24
  const m = min % 60
  return (
    <span className={`klokke ${className}`}>
      {String(h).padStart(2, '0')}
      <i>:</i>
      {String(m).padStart(2, '0')}
    </span>
  )
}
