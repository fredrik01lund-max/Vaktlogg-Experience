import { useEffect, useState } from 'react'
import { kilder } from '../content/kilder.ts'
import { manus, PLAN_TOTAL } from '../content/manus.ts'
import { mmss, planTid, sceneStart, taktPlan } from '../content/tid.ts'
import type { Ordet } from '../content/types.ts'
import { mobilAdresse, romkode, speilmodus } from '../lib/mobil.ts'
import { FARGE, medNavn, navnMangler, oppsett } from '../lib/oppsett.ts'
import { apneVindu, forrige, gaTil, lydtest, neste, nullstill, nyDemo, start, svart, useStatus, useTilstand, velg } from '../lib/sync.ts'
import { VALG } from '../scenes/Del2.tsx'

// Presentatørvisningen: eget vindu på bærbar-skjermen. Viser hvem som snakker, manus,
// regi, nedtelling for animasjoner, tid mot plan, neste overgang og kildene.

function hvemTekst(h: Ordet) {
  if (h === 'stille') return 'STILLE'
  if (h === 'sensor') return 'SENSOR'
  if (h === 'alle') return 'ALLE TRE'
  return `${h} · ${oppsett.presentatorer[h].navn}`
}
function hvemFarge(h: Ordet) {
  return h === 'A' || h === 'B' || h === 'C' ? FARGE[h] : h === 'sensor' ? '#E9C27A' : 'rgba(244,237,228,0.5)'
}

function useNaa() {
  const [n, setN] = useState(Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setN(Date.now()), 250)
    return () => clearInterval(id)
  }, [])
  return n
}

export function Presentator() {
  const t = useTilstand()
  const status = useStatus()
  const naa = useNaa()
  const scene = manus[t.scene] ?? manus[0]
  const takt = scene.takter[t.takt] ?? scene.takter[0]
  const starter = sceneStart(manus)
  const plan = taktPlan(scene)

  const brukt = t.startet && t.start ? (naa - t.start) / 1000 : 0
  const planNaa = planTid(manus, t.scene, t.takt)
  const iTakt = (naa - t.taktFra) / 1000
  const avvik = t.startet ? brukt - (planNaa + Math.min(iTakt, plan[t.takt])) : 0
  const iScene = (naa - t.sceneFra) / 1000
  const animIgjen = takt.anim ? Math.max(0, takt.anim - iTakt) : 0
  const hovedTilkoblet = naa - status.sist < 5000
  // Koden til sensors mobil vises her også når hovedskjermen ikke er åpnet ennå (samme lager, samme kode)
  const [egenMobil, setEgenMobil] = useState<{ kode: string; adresse: string } | null>(null)
  useEffect(() => {
    speilmodus().then((m) => m === 'rele' && setEgenMobil({ kode: romkode(), adresse: mobilAdresse() }))
  }, [])
  const mobilKode = status.mobilKode ?? egenMobil?.kode ?? null

  // Neste takt/scene
  const sisteTakt = t.takt >= scene.takter.length - 1
  const nesteScene = sisteTakt ? manus[t.scene + 1] : scene
  const nesteTakt = sisteTakt ? nesteScene?.takter[0] : scene.takter[t.takt + 1]
  const bytter = nesteTakt && nesteTakt.hvem !== takt.hvem

  useEffect(() => {
    const ned = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (['ArrowRight', 'PageDown', ' ', 'ArrowDown', 'Enter'].includes(e.key)) {
        e.preventDefault()
        neste()
      } else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        forrige()
      } else if (e.key === 'F5' || e.key === 'Escape') e.preventDefault()
      else if (e.key === 'b' || e.key === 'B' || e.key === '.') svart()
      else if (/^[1-4]$/.test(e.key) && scene.id === 'sensor') velg(Number(e.key))
    }
    window.addEventListener('keydown', ned)
    return () => window.removeEventListener('keydown', ned)
  }, [scene.id])

  return (
    <div className="pv">
      <header className="pv-topp">
        <div className="pv-tid">
          <span className="pv-stor">{mmss(brukt)}</span>
          <small>av {mmss(PLAN_TOTAL)}</small>
        </div>
        <div className={`pv-avvik ${Math.abs(avvik) < 10 ? 'ok' : avvik > 0 ? 'bak' : 'foran'}`}>
          {t.startet ? (Math.abs(avvik) < 3 ? 'I rute' : avvik > 0 ? `${mmss(avvik)} bak planen` : `${mmss(-avvik)} foran planen`) : 'Ikke startet'}
        </div>
        <div className="pv-klokke">{new Date(naa).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="pv-status">
          <span className={hovedTilkoblet ? 'ok' : 'feil'}>{hovedTilkoblet ? 'Hovedskjerm tilkoblet' : 'Hovedskjerm ikke funnet'}</span>
          <span className={status.film === 'klar' ? 'ok' : status.film === 'feil' ? 'feil' : ''}>Film {status.film === 'klar' ? 'lastet' : status.film === 'feil' ? 'mangler' : 'laster …'}</span>
          {status.mobil !== null && status.mobil !== undefined && <span className={status.mobil > 0 ? 'ok' : 'feil'}>{status.mobil > 0 ? 'Sensors mobil tilkoblet' : 'Sensors mobil IKKE tilkoblet'}</span>}
        </div>
        <div className="pv-knapper">
          {!hovedTilkoblet && <button onClick={() => apneVindu('hoved')}>Åpne hovedskjerm</button>}
          <button onClick={(e) => { e.currentTarget.blur(); if (!t.startet || confirm('Presentasjonen er i gang. Tilbake til venteskjermen og klokka på 0:00?')) nullstill() }} title="Tilbake til venteskjermen, klokka på 0:00 – uten å starte">Klar til start</button>
          <button onClick={(e) => { e.currentTarget.blur(); lydtest() }} title="Hovedskjermen spiller Sir Domeos første replikk">Test lyd</button>
          <button onClick={(e) => { e.currentTarget.blur(); nyDemo() }} title="Last prototypen på nytt med rene data (også på sensors mobil)">Nullstill demo</button>
          <button onClick={() => (confirm('Starte hele presentasjonen på nytt og nullstille tiden?') ? (nullstill(), start()) : null)}>Start på nytt</button>
        </div>
      </header>

      {navnMangler && <div className="pv-varsel">Navnene er fortsatt «Presentatør A/B/C» – skriv dem inn i oppsett.js.</div>}
      {mobilKode && (
        <div className={`pv-mobil ${status.mobil && hovedTilkoblet ? 'ok' : ''}`}>
          {status.rele === false && hovedTilkoblet
            ? 'Får ikke kontakt med mobilreléet. Sjekk at PC-en har internett.'
            : status.mobil && hovedTilkoblet
              ? `Sensors mobil er koblet til (kode ${mobilKode}).`
              : <>Sensors mobil: åpne <b>{status.mobilAdresse || egenMobil?.adresse}</b> og skriv koden <b className="pv-kode">{mobilKode}</b>. Mobilen husker koden til neste gang.</>}
        </div>
      )}

      <main className="pv-midt">
        <section className="pv-na">
          <div className="pv-hvem" style={{ color: hvemFarge(takt.hvem) }}>
            <span className="pv-prikk" style={{ background: hvemFarge(takt.hvem) }} />
            {hvemTekst(takt.hvem)}
          </div>
          <div className="pv-scene">
            <span>
              {String(t.scene + 1).padStart(2, '0')} / {manus.length} · {scene.del}
            </span>
            <b>{scene.tittel}</b>
            <span className="pv-scenetid">
              {mmss(iScene)} / {mmss(scene.varighet)}
            </span>
          </div>
          <div className="pv-scenebar">
            <i style={{ width: `${Math.min(100, (iScene / scene.varighet) * 100)}%`, background: iScene > scene.varighet ? '#ff8a7a' : undefined }} />
          </div>

          {takt.anim && animIgjen > 0 ? (
            <div className="pv-vent">
              <b>Vent</b> – animasjonen går i {Math.ceil(animIgjen)} s
              <i style={{ width: `${(1 - animIgjen / takt.anim) * 100}%` }} />
            </div>
          ) : takt.anim ? (
            <div className="pv-klar">Klar{takt.hvem === 'stille' && nesteTakt ? ` – ${hvemTekst(nesteTakt.hvem)} tar over` : ''}</div>
          ) : null}

          {takt.hvem === 'sensor' && scene.id !== 'sensor' && (
            <div className={`pv-sensortid ${iTakt > 150 ? 'over' : iTakt > (takt.sek ?? 130) ? 'snart' : ''}`}>
              <b>Sensor prøver selv: {mmss(iTakt)}</b>
              <span>{iTakt > 150 ? 'Ta over nå.' : `Planlagt ${mmss(takt.sek ?? 130)} – C tar over senest ved 2:30.`}</span>
              <i style={{ width: `${Math.min(100, (iTakt / 150) * 100)}%` }} />
            </div>
          )}

          {takt.hvem === 'sensor' && scene.id === 'sensor' && (
            <div className="pv-sensor">
              {VALG.map((v, i) => (
                <button key={i} onClick={() => velg(i + 1)}>
                  <b>{i + 1}</b> {v.tekst}
                </button>
              ))}
            </div>
          )}

          <div className="pv-takter">
            {scene.takter.map((k, i) => (
              <div key={i} className={`pv-takt ${i === t.takt ? 'na' : i < t.takt ? 'ferdig' : ''}`} onClick={() => gaTil(t.scene, i)}>
                <div className="pv-takt-hode">
                  <span style={{ color: hvemFarge(k.hvem) }}>{hvemTekst(k.hvem)}</span>
                  <small>
                    klikk {i + 1} · ca. {Math.round(plan[i])} s{k.anim ? ` · animasjon ${k.anim} s` : ''}
                    {k.auto ? ' · går videre selv' : ''}
                  </small>
                </div>
                {k.sier && <p className="pv-sier">{medNavn(k.sier)}</p>}
                {k.regi && <p className="pv-regi">{k.regi}</p>}
              </div>
            ))}
          </div>
        </section>

        <aside className="pv-side">
          <div className="pv-boks">
            <h3>Neste</h3>
            {nesteTakt ? (
              <>
                <div className="pv-neste-hvem" style={{ color: hvemFarge(nesteTakt.hvem) }}>
                  {bytter ? '↪ ' : ''}
                  {hvemTekst(nesteTakt.hvem)}
                  {sisteTakt && <small> · {nesteScene.tittel}</small>}
                </div>
                {nesteTakt.sier && <p className="pv-sier liten">{medNavn(nesteTakt.sier).slice(0, 160)}{medNavn(nesteTakt.sier).length > 160 ? ' …' : ''}</p>}
                {nesteTakt.regi && !nesteTakt.sier && <p className="pv-regi">{nesteTakt.regi}</p>}
              </>
            ) : (
              <p>Slutt – spørsmål.</p>
            )}
          </div>
          <div className="pv-boks">
            <h3>Overgang</h3>
            <p>{scene.overgang}</p>
          </div>
          {status.demo && scene.id === 'demo' && (
            <div className="pv-boks">
              <h3>I prototypen nå</h3>
              <p>{status.demo}</p>
            </div>
          )}
          <div className="pv-boks">
            <h3>Kilder</h3>
            {scene.kilder.length ? (
              <ul>
                {scene.kilder.map((k) => (
                  <li key={k}>{kilder[k]}</li>
                ))}
              </ul>
            ) : (
              <p>–</p>
            )}
          </div>
        </aside>
      </main>

      <footer className="pv-bunn">
        <div className="pv-tidslinje">
          {manus.map((s, i) => {
            const h = s.takter.find((k) => k.hvem === 'A' || k.hvem === 'B' || k.hvem === 'C')?.hvem ?? 'stille'
            return (
              <button
                key={s.id}
                className={`pv-bit ${i === t.scene ? 'na' : ''}`}
                style={{ flexGrow: s.varighet, ['--f' as string]: hvemFarge(s.takter.every((k) => k.hvem === 'stille') ? 'stille' : h) }}
                onClick={() => gaTil(i)}
                title={`${mmss(starter[i])} ${s.tittel}`}
              >
                <span>{s.tittel}</span>
              </button>
            )
          })}
          {t.startet && <i className="pv-spilleplass" style={{ left: `${Math.min(100, (brukt / PLAN_TOTAL) * 100)}%` }} />}
        </div>
        <div className="pv-styr">
          <button onClick={forrige}>← Forrige</button>
          <button className="pv-svart" onClick={() => svart()}>
            {t.svart ? 'Vis skjermen' : 'Svart skjerm'}
          </button>
          <button className="pv-nesteknapp" onClick={neste}>
            {t.startet ? 'Neste →' : 'Start presentasjonen →'}
          </button>
        </div>
      </footer>
    </div>
  )
}
