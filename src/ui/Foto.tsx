import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { fargefilter, foto as hentFoto } from '../lib/foto.ts'

// Ett fotografi fra foto.js – eller en rolig plassholder når bildet mangler, ikke er klarert
// eller ikke laster. Fokuspunktet styrer både beskjæringen og hvor kameraet kjører inn.

let plassholderTekst = true
try {
  plassholderTekst = localStorage.getItem('vaktlogg-experience:skjul-plassholdere') !== '1'
} catch {
  /* standard: vis */
}
const lyttere = new Set<(v: boolean) => void>()
export function vekslePlassholdertekst() {
  plassholderTekst = !plassholderTekst
  try {
    localStorage.setItem('vaktlogg-experience:skjul-plassholdere', plassholderTekst ? '0' : '1')
  } catch {
    /* ikke viktig */
  }
  lyttere.forEach((f) => f(plassholderTekst))
}
function useVisTekst() {
  const [v, setV] = useState(plassholderTekst)
  useEffect(() => {
    lyttere.add(setV)
    return () => void lyttere.delete(setV)
  }, [])
  return v
}

type Props = {
  id: string
  className?: string
  /** Kamerabevegelse: inn = sakte inn mot fokuspunktet, ut = sakte ut, drift = sideveis (2,5D med lag) */
  kamera?: 'inn' | 'ut' | 'drift' | 'stille'
  /** Sekunder for kamerabevegelsen */
  tid?: number
  /** Vis bildetekst og kreditering */
  tekst?: boolean
  style?: CSSProperties
  children?: ReactNode
}

export function Foto({ id, className = '', kamera = 'inn', tid = 18, tekst = false, style, children }: Props) {
  const f = hentFoto(id)
  const [feil, setFeil] = useState(false)
  const visTekst = useVisTekst()
  const ok = f.status === 'ok' && !feil
  const pos = `${f.fokus[0] * 100}% ${f.fokus[1] * 100}%`
  const filter = fargefilter(f.plass.justering)
  const vars = { '--kamera-tid': `${tid}s`, ...style } as CSSProperties

  return (
    <div className={`foto kamera-${kamera} ${ok ? 'har-bilde' : 'plassholder'} ${className}`} style={vars} data-foto={id}>
      {ok && f.lag.length > 0 ? (
        f.lag.map((l, i) => (
          <img
            key={i}
            className="foto-lag"
            src={l.url}
            alt=""
            draggable={false}
            onError={() => setFeil(true)}
            style={{ objectPosition: pos, transformOrigin: pos, filter, ['--dybde' as string]: l.dybde }}
          />
        ))
      ) : ok ? (
        <img className="foto-bilde" src={f.url!} alt={f.plass.tekst || ''} draggable={false} onError={() => setFeil(true)} style={{ objectPosition: pos, transformOrigin: pos, filter }} />
      ) : (
        <div className="foto-tom" aria-hidden="true">
          <span className="lys l1" />
          <span className="lys l2" />
          <span className="lys l3" />
          {visTekst && (
            <span className="foto-tom-tekst">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
                <circle cx="12" cy="13" r="3.6" />
              </svg>
              <span>
                <b>{f.status === 'ikke-klarert' ? 'Foto venter på samtykke' : feil ? 'Fant ikke bildefilen' : 'Foto kommer'}</b>
                {f.plass.beskrivelse && <small>{f.plass.beskrivelse}</small>}
                <small className="id">{id}</small>
              </span>
            </span>
          )}
        </div>
      )}
      <div className="foto-tone" />
      {children}
      {tekst && ok && (f.plass.tekst || f.plass.kreditering) && (
        <div className="foto-tekst">
          {f.plass.tekst}
          {f.plass.tekst && f.plass.kreditering ? ' · ' : ''}
          {f.plass.kreditering}
        </div>
      )}
    </div>
  )
}
