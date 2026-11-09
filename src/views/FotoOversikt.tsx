import { useState } from 'react'
import { allePlasser, EKSAMEN, foto } from '../lib/foto.ts'
import { Foto } from '../ui/Foto.tsx'

// ?vis=foto – alle fotoplassene: status, samtykke og fokuspunkt.
// Trykk på et bilde for å sette fokuspunktet; linjen som skal inn i foto.js vises under.

export function FotoOversikt() {
  const [fokus, setFokus] = useState<Record<string, [number, number]>>({})
  const plasser = allePlasser()
  const ferdige = plasser.filter((id) => foto(id).status === 'ok').length

  return (
    <div className="fo">
      <header>
        <small>VAKTLOGG EXPERIENCE · fotografier</small>
        <h1>
          {ferdige} av {plasser.length} plasser har bilde
        </h1>
        <p>
          {EKSAMEN
            ? 'Denne versjonen viser bilder klarert for eksamen (lokal øving eller eksamensmappen).'
            : 'Dette er den offentlige versjonen: bare bilder med samtykke.offentlig vises.'}{' '}
          Endre i <code>foto/foto.js</code> og last siden på nytt. Trykk på et bilde for å sette fokuspunkt.
        </p>
      </header>
      <div className="fo-rutenett">
        {plasser.map((id) => {
          const f = foto(id)
          const fk = fokus[id] ?? f.fokus
          return (
            <article key={id} className={`fo-kort ${f.status}`}>
              <div
                className="fo-bilde"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  setFokus((s) => ({ ...s, [id]: [+((e.clientX - r.left) / r.width).toFixed(2), +((e.clientY - r.top) / r.height).toFixed(2)] }))
                }}
              >
                <Foto id={id} kamera="stille" style={{ ['--fx' as string]: fk[0] }} />
                <i className="fo-fokus" style={{ left: `${fk[0] * 100}%`, top: `${fk[1] * 100}%` }} />
              </div>
              <div className="fo-info">
                <b>{id}</b>
                <span className={`fo-status ${f.status}`}>{f.status === 'ok' ? 'Vises' : f.status === 'mangler' ? 'Mangler bilde' : 'Bilde finnes, men samtykket dekker ikke denne versjonen'}</span>
                <p>{f.plass.beskrivelse}</p>
                <small>
                  Samtykke: eksamen {f.plass.samtykke?.eksamen ? 'ja' : 'nei'} · offentlig {f.plass.samtykke?.offentlig ? 'ja' : 'nei'}
                  {f.plass.identifiserbar ? ' · identifiserbar' : ''}
                  {id === 'portrett' ? ` · kan knyttes til sitat: ${f.plass.kanKnyttesTilSitat ? 'ja' : 'nei'}` : ''}
                </small>
                {fokus[id] && <code>fokus: [{fk[0]}, {fk[1]}],</code>}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
