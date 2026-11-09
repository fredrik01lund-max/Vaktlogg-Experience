import { useState } from 'react'
import { kilder } from '../content/kilder.ts'
import { lagtTilSide } from '../content/arkiv.ts'
import { manus, PLAN_TOTAL } from '../content/manus.ts'
import { fordeling, manusTid, mmss, sceneStart, taktPlan } from '../content/tid.ts'
import type { Hvem, Ordet } from '../content/types.ts'
import { FARGE, medNavn, oppsett } from '../lib/oppsett.ts'

// Det utskrivbare manuset – reserve hvis presentatørvinduet ikke kan brukes, og til øving.
// ?vis=manus · ?vis=manus&hvem=A viser bare A sine deler (resten nedtonet).

export function Manus() {
  const params = new URLSearchParams(window.location.search)
  const [hvem, setHvem] = useState<Hvem | null>((params.get('hvem') as Hvem) || null)
  const starter = sceneStart(manus)
  const f = fordeling(manus)
  const m = manusTid(manus)
  const navnPa = (h: Ordet) => (h === 'A' || h === 'B' || h === 'C' ? `${h} · ${oppsett.presentatorer[h].navn}` : h === 'stille' ? 'Stille' : h === 'sensor' ? 'Sensor' : 'Alle tre')

  return (
    <div className="manus">
      <header className="manus-topp">
        <div>
          <small>VAKTLOGG EXPERIENCE · manus</small>
          <h1>Behind the shift</h1>
          <p>
            12 minutter · tre presentatører · {manus.length} scener. Klikk = ett trykk på klikkeren. <em>Kursiv</em> = regi.
          </p>
        </div>
        <div className="manus-filter no-print">
          <button className={!hvem ? 'pa' : ''} onClick={() => setHvem(null)}>
            Alle
          </button>
          {(['A', 'B', 'C'] as const).map((h) => (
            <button key={h} className={hvem === h ? 'pa' : ''} style={{ ['--f' as string]: FARGE[h] }} onClick={() => setHvem(h)}>
              {oppsett.presentatorer[h].navn}
            </button>
          ))}
          <button onClick={() => window.print()}>Skriv ut</button>
        </div>
      </header>

      <table className="manus-fordeling">
        <thead>
          <tr>
            <th>Presentatør</th>
            <th>Ansvar</th>
            <th>Planlagt tid</th>
            <th>Beregnet fra manus</th>
          </tr>
        </thead>
        <tbody>
          {(['A', 'B', 'C'] as const).map((h) => (
            <tr key={h}>
              <td>
                <span className="manus-prikk" style={{ background: FARGE[h] }} /> {h} · {oppsett.presentatorer[h].navn}
              </td>
              <td>{oppsett.presentatorer[h].rolle}</td>
              <td>{mmss(f[h])}</td>
              <td>{mmss(m[h])}</td>
            </tr>
          ))}
          <tr>
            <td>Stille sekvenser og sensor</td>
            <td>Film, animasjon, sensors valg</td>
            <td>{mmss(f.stille + f.sensor)}</td>
            <td />
          </tr>
          <tr className="sum">
            <td>Totalt</td>
            <td />
            <td>{mmss(PLAN_TOTAL)}</td>
            <td />
          </tr>
        </tbody>
      </table>

      {manus.map((s, i) => {
        const plan = taktPlan(s)
        const relevant = !hvem || s.takter.some((k) => k.hvem === hvem || k.hvem === 'alle')
        return (
          <section key={s.id} className={`manus-scene ${relevant ? '' : 'nedtonet'}`}>
            <div className="manus-scene-hode">
              <span className="manus-tid">
                {mmss(starter[i])}–{mmss(starter[i] + s.varighet)}
              </span>
              <h2>
                {String(i + 1).padStart(2, '0')} {s.tittel}
              </h2>
              <span className="manus-del">
                {s.del}
                {s.fase ? ` · ${s.fase}` : ''} · {s.varighet} s
              </span>
            </div>
            {s.takter.map((k, j) => (
              <div key={j} className={`manus-takt ${hvem && k.hvem !== hvem && k.hvem !== 'alle' ? 'annen' : ''}`}>
                <div className="manus-hvem" style={{ color: k.hvem in FARGE ? FARGE[k.hvem as Hvem] : undefined }}>
                  {navnPa(k.hvem)}
                  <small>
                    klikk {j + 1} · ca. {Math.round(plan[j])} s{k.anim ? ` · animasjon ${k.anim} s – vent` : ''}
                  </small>
                </div>
                <div>
                  {k.sier && <p className="manus-sier">{medNavn(k.sier)}</p>}
                  {k.regi && <p className="manus-regi">{k.regi}</p>}
                </div>
              </div>
            ))}
            <p className="manus-overgang">
              <b>Overgang:</b> {s.overgang}
            </p>
            {s.kilder.length > 0 && (
              <p className="manus-kilder">
                <b>Kilder:</b> {s.kilder.map((k) => kilder[k]).join(' · ')}
              </p>
            )}
          </section>
        )
      })}

      <section className="manus-scene">
        <h2>Innhold dere må avgjøre</h2>
        <ul className="manus-sjekk">
          <li>
            <b>Del 3, skrittene:</b> A sier «en rekord på 25 000 skritt» (hovmesteren), men telleren på skjermen går til 15 000 (fra et annet intervju). Bestem hvilket tall og hvilket intervju A skal vise til, så tale og skjerm stemmer.
          </li>
          <li>
            <b>Del 5, lederen:</b> replikken «En kollega er syk. Kan du ta stasjonen hennes?» er vår formulering av det manuset beskriver. Godkjenn eller endre den i V2.tsx (BOBLER).
          </li>
          <li>
            <b>Fotografier:</b> servitøren vi intervjuet (del 2, plassen innsikt-2) og papirskissen (del 7) mangler. Legg dem inn i foto.js med samtykke. Bildene fra Noode Sky og Park 29 er klarert for nett.
          </li>
        </ul>
      </section>

      <section className="manus-scene">
        <h2>Før fremføringen</h2>
        <ul className="manus-sjekk">
          <li>Åpne presentasjonen på projektoren, trykk <b>F</b> for fullskjerm og <b>P</b> for presentatørvisningen. Dra presentatørvinduet til den bærbare skjermen.</li>
          <li>Sjekk at presentatørvisningen sier «Hovedskjerm tilkoblet» og «Film lastet».</li>
          <li>Sensors mobil: koble PC-en og mobilen til samme nett (en mobil-hotspot holder – internett trengs ikke), start <b>npm run eksamen</b> og åpne presentasjonen på adressen den skriver ut. Åpne mobiladressen den skriver ut på mobilen vi gir sensor, og sett mobilen til å ikke låse seg.</li>
          <li>Lyd: Sir Domeos stemme kommer fra PC-en – koble til høyttaler og prøv volumet.</li>
          <li>Trykk «Nullstill demo» – prototypen og mobilen starter omvisningen på nytt.</li>
          <li>Uten mobil eller tjener: omvisningen går på storskjermen, og sensor (eller C) trykker rett på den.</li>
          <li>Klikkeren: PageDown/PageUp. Den virker også når fokus er inne i prototypen.</li>
          <li>Uten nett og uten tjener: bruk eksamensmappen (index.html åpnes med dobbeltklikk). Presentatørvinduet virker da også – åpnes med P.</li>
          <li>Reserve hvis presentatørvinduet ikke virker: dette manuset på papir, og tidsplanen over.</li>
        </ul>
      </section>

      <section className="manus-scene nedtonet">
        <h2>Lagt til side</h2>
        <p className="manus-regi">Ikke med i 12-minuttersflyten. Ligger i src/content/arkiv.ts og kan vises fra oversikten (O).</p>
        {lagtTilSide.map((s) => (
          <details key={s.id} className="manus-arkiv">
            <summary>
              {s.tittel} <small>· {s.del} · {s.varighet} s</small>
            </summary>
            {s.takter.map((k, j) => (
              <div key={j} className="manus-takt">
                <div className="manus-hvem">{navnPa(k.hvem)}</div>
                <div>
                  {k.sier && <p className="manus-sier">{medNavn(k.sier)}</p>}
                  {k.regi && <p className="manus-regi">{k.regi}</p>}
                </div>
              </div>
            ))}
          </details>
        ))}
      </section>
    </div>
  )
}
