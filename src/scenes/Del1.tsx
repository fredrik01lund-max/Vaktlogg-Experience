import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { manus } from '../content/manus.ts'
import apningMeta from '../lib/apning.json'
import { filmUrl } from '../lib/film.ts'
import { foto } from '../lib/foto.ts'
import { oppsett, navn } from '../lib/oppsett.ts'
import { hent, neste } from '../lib/sync.ts'
import { Foto } from '../ui/Foto.tsx'
import { FILM, Inn, MYK, useFilmVakt, useLys, useSek, type SceneProps } from './felles.tsx'

/* ══ 1. «Vakten ovenfra» (stille, 22 s) ═══════════════════════════════════════════
   Blender-filmen (public/film/apning.mp4, laget av blender/apning_vakt.py): servitøren stempler inn på
   telefonen (klokka starter i samme øyeblikk), tar brettet, og kameraet løfter seg over restauranten mens vakten tar av – gjester, bonger,
   bord som skifter farge som i appen, og et lysende spor der hun går. Lysene slukkes, sporet
   blir igjen. Ingen ord – bare klokka, som følger filmen, og tittelen til slutt. */

export function Apning() {
  useLys(0)
  const video = useRef<HTMLVideoElement>(null)
  const [t, setT] = useState(0)
  const [feil, setFeil] = useState(false)

  // Tiden følger filmen selv, så klokka og tittelen står i takt med bildet
  useEffect(() => {
    const v = video.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => setFeil(true))
    let id = 0
    const tikk = () => {
      setT(v.currentTime)
      id = requestAnimationFrame(tikk)
    }
    id = requestAnimationFrame(tikk)
    return () => cancelAnimationFrame(id)
  }, [])

  // Når filmen er ferdig, går presentasjonen videre til tittelen – og A begynner å snakke
  const ferdig = () => {
    const t = hent()
    const id = manus[t.scene]?.id
    if ((id === 'apning' || id === 'vakten') && t.takt === 0) neste()
  }
  useFilmVakt(video, true, () => setFeil(true))
  useEffect(() => {
    if (!feil) return
    const id = window.setTimeout(ferdig, 4000)
    return () => clearTimeout(id)
  }, [feil])

  const { vaktStart, vaktSlutt, lysAv, varighet } = apningMeta
  const andel = Math.min(1, Math.max(0, (t - vaktStart) / (vaktSlutt - vaktStart)))
  const min = Math.round(16 * 60 + andel * 450)
  const tittel = feil || t > varighet - 2.6

  return (
    <div className="scene apning">
      <video ref={video} className="apning-film" src={filmUrl('apning')} muted playsInline preload="auto" onEnded={ferdig} onError={() => setFeil(true)} />

      <motion.div className="apning-klokke" initial={{ opacity: 0 }} animate={{ opacity: t > vaktStart + 0.05 && t < lysAv ? 1 : 0 }} transition={{ duration: 0.8 }}>
        <span className="overtittel">En tenkt fredag på en fiktiv restaurant</span>
        <span className="klokke">
          {String(Math.floor(min / 60)).padStart(2, '0')}
          <i>:</i>
          {String(min % 60).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Mørkere midtparti bak tittelen, så teksten står klart over det lysende sporet */}
      <motion.div className="tittel-dimmer" initial={{ opacity: 0 }} animate={{ opacity: tittel ? 1 : 0 }} transition={{ duration: 1.6 }} />
      <Tittel vis={tittel} />

      {/* Filmformat (2,39:1) til tittelen kommer */}
      <motion.div className="sperre topp" initial={{ height: 138 }} animate={{ height: tittel ? 0 : 138 }} transition={{ duration: 1.8, ease: FILM }} />
      <motion.div className="sperre bunn" initial={{ height: 138 }} animate={{ height: tittel ? 0 : 138 }} transition={{ duration: 1.8, ease: FILM }} />
    </div>
  )
}

function Tittel({ vis, navnene = false }: { vis: boolean; navnene?: boolean }) {
  return (
    <div className="tittel-blokk">
      <Inn vis={vis} className="tittel-vaktlogg" tid={1.6}>
        VAKTLOGG
      </Inn>
      <Inn vis={vis} d={0.35} className="tittel-bak stor-serif" tid={1.8}>
        Behind the shift
      </Inn>
      <Inn vis={vis && navnene} d={0.5} className="tittel-navn">
        {navn('A')} <i>·</i> {navn('B')} <i>·</i> {navn('C')}
      </Inn>
    </div>
  )
}

/* ══ 2. Behind the shift – åpning og utgangspunkt (A) ═══════════════════════════
   Bak tittelen står siste bilde fra åpningsfilmen (sporet i mørket), så overgangen er sømløs. */

export function TittelScene({ takt }: SceneProps) {
  useLys(takt === 0 ? 0 : 0.35)
  const [harBilde, setHarBilde] = useState(true)
  return (
    <div className="scene tittel-scene">
      {harBilde && (
        <motion.img className="apning-film" src="film/apning-slutt.png" alt="" onError={() => setHarBilde(false)} initial={false} animate={{ opacity: takt === 0 ? 1 : 0, scale: takt === 0 ? 1 : 1.04 }} transition={{ duration: 1.6, ease: MYK }} />
      )}
      <motion.div className="tittel-dimmer" initial={false} animate={{ opacity: takt === 0 && harBilde ? 1 : 0 }} transition={{ duration: 1.2 }} />
      <motion.div animate={{ y: takt >= 1 ? -330 : 0, scale: takt >= 1 ? 0.55 : 1, opacity: takt >= 1 ? 0 : 1 }} transition={{ duration: 1.3, ease: MYK }} style={{ position: 'absolute', inset: 0 }}>
        <Tittel vis navnene />
      </motion.div>

      <div className="utgangspunkt">
        <Inn vis={takt >= 1} d={0.3} className="overtittel">
          Utgangspunktet
        </Inn>
        <Inn vis={takt >= 1} d={0.5} className="utgangspunkt-ord stor-serif">
          Sykefravær
        </Inn>
        <Inn vis={takt >= 1} d={1.2} className="utgangspunkt-trekk tekst">
          Knapp bemanning, små marginer og lange, fysiske dager.
        </Inn>
      </div>
    </div>
  )
}

/* ══ 3. Menneskene bak innsikten (A, Empathize) ══════════════════════════════════ */

// Mosaikken: plassering (px på 1920 × 1080), størrelse og dybde
const MOSAIKK = [
  { id: 'mennesker-1', x: 150, y: 170, w: 360, h: 470, z: 0 },
  { id: 'mennesker-2', x: 560, y: 120, w: 520, h: 340, z: 1 },
  { id: 'mennesker-3', x: 1130, y: 160, w: 300, h: 400, z: 0.4 },
  { id: 'mennesker-4', x: 1480, y: 110, w: 330, h: 300, z: 1.2 },
  { id: 'mennesker-5', x: 560, y: 500, w: 330, h: 420, z: 0.6 },
  { id: 'mennesker-6', x: 940, y: 610, w: 520, h: 330, z: 0.2 },
  { id: 'mennesker-7', x: 1510, y: 450, w: 300, h: 430, z: 0.9 },
  { id: 'mennesker-8', x: 170, y: 690, w: 340, h: 250, z: 1.4 },
]

export function Metode({ takt }: SceneProps) {
  useLys(takt === 2 ? 0 : 0.25)
  const n = oppsett.innsikt.transkriberteIntervjuer
  const kilder = [
    { tittel: 'Intervjuer', tekst: n ? `${n} foreligger som transkripsjon – flere er gjennomført` : 'Noen foreligger som transkripsjon – ikke alle', farge: 'var(--papir)' },
    { tittel: 'Samtaler', tekst: 'Uformelle samtaler med ansatte i bransjen', farge: 'var(--papir)' },
    { tittel: 'Observasjoner', tekst: `Servitører i arbeid – blant annet ${oppsett.innsikt.observasjonssteder.join(' og ')}`, farge: 'var(--mint)' },
    { tittel: 'Egen erfaring', tekst: 'Servitør, hovmester og daglig leder', merk: 'Risiko: vi tolker gjennom egne briller', farge: 'var(--rosa)' },
  ]
  return (
    <div className="scene metode">
      <motion.div
        className="mosaikk"
        animate={{ scale: takt === 0 ? 1 : 0.86, opacity: takt === 0 ? 1 : takt === 1 ? 0.18 : 0, filter: takt === 0 ? 'blur(0px)' : 'blur(6px)' }}
        transition={{ duration: 1.4, ease: MYK }}
      >
        {MOSAIKK.map((m, i) => (
          <motion.div
            key={m.id}
            className="mosaikk-bit"
            style={{ left: m.x, top: m.y, width: m.w, height: m.h }}
            initial={{ opacity: 0, scale: 1.5 + m.z * 0.4, z: 400, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, z: 0, filter: 'blur(0px)', y: [0, -8 - m.z * 6, 0], transitionEnd: { filter: 'none' } }}
            transition={{ duration: 1.6, delay: 0.15 + i * 0.16, ease: MYK, y: { duration: 9 + m.z * 3, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
          >
            <Foto id={m.id} kamera="drift" tid={16 + i} />
          </motion.div>
        ))}
      </motion.div>

      <Inn vis={takt === 0} d={1.6} className="metode-tekst">
        <div className="overtittel">Empathize</div>
        <h2 className="stor-serif">Menneskene bak innsikten</h2>
        <div className="metode-roller">
          {['Servitører', 'Hovmestere', 'Restaurantledere', 'Andre ansatte'].map((r) => (
            <span key={r} className="merket">
              {r}
            </span>
          ))}
        </div>
      </Inn>

      <div className="kilder-rad">
        {kilder.map((k, i) => (
          <Inn key={k.tittel} vis={takt === 1} d={0.25 + i * 0.3} className="kilde-kort">
            <span className="kilde-nr" style={{ color: k.farge }}>
              0{i + 1}
            </span>
            <b>{k.tittel}</b>
            <p>{k.tekst}</p>
            {k.merk && <small>{k.merk}</small>}
          </Inn>
        ))}
      </div>

      <div className="to-vakter">
        <motion.div className="vakt-halvdel god" initial={{ opacity: 0, x: -60 }} animate={{ opacity: takt === 2 ? 1 : 0, x: takt === 2 ? 0 : -60 }} transition={{ duration: 1.3, ease: MYK }}>
          <span className="overtittel">En travel vakt</span>
          <b className="stor-serif">som føltes bra</b>
        </motion.div>
        <motion.div className="vakt-halvdel tung" initial={{ opacity: 0, x: 60 }} animate={{ opacity: takt === 2 ? 1 : 0, x: takt === 2 ? 0 : 60 }} transition={{ duration: 1.3, delay: 0.3, ease: MYK }}>
          <span className="overtittel">En travel vakt</span>
          <b className="stor-serif">som føltes dårlig</b>
        </motion.div>
        <Inn vis={takt === 2} d={1.5} className="vakt-sporsmal">
          <span>Like travelt.</span> <span>Ulik opplevelse.</span> <em>Hva er forskjellen?</em>
        </Inn>
      </div>
    </div>
  )
}

/* ══ 4. Cinematic portrait reveal (A) ════════════════════════════════════════════
   Personen på bildet knyttes IKKE til sitatet, med mindre foto.js sier kanKnyttesTilSitat.
   Da skilles bilde og sitat tydelig, og bildeteksten sier det. */

const SITAT = 'Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.'

export function Portrett({ takt }: SceneProps) {
  useLys(0)
  const f = foto('portrett')
  const knyttet = f.status === 'ok' && f.plass.kanKnyttesTilSitat === true
  const ord = SITAT.split(' ')
  return (
    <div className={`scene portrett ${knyttet ? 'knyttet' : 'adskilt'}`}>
      <motion.div
        className="portrett-bilde"
        initial={{ opacity: 0, filter: 'brightness(0) blur(6px)' }}
        animate={
          takt === 0 || knyttet
            ? { opacity: 1, filter: 'brightness(1) blur(0px)', x: knyttet && takt >= 1 ? -420 : 0, width: knyttet && takt >= 1 ? '62%' : '100%' }
            : { opacity: 0.32, filter: 'brightness(0.55) blur(4px)', x: -560, width: '62%' }
        }
        transition={{ duration: takt === 0 ? 3.2 : 1.6, ease: FILM }}
      >
        <Foto id="portrett" kamera="inn" tid={24} tekst={takt === 0} />
      </motion.div>

      {takt >= 1 && !knyttet && f.status === 'ok' && (
        <Inn d={1} className="portrett-merknad">
          Personen på bildet er ikke den som siteres.
        </Inn>
      )}

      <div className="sitat">
        <Inn vis={takt >= 1} d={0.6} className="sitat-tegn">
          «
        </Inn>
        <p className="stor-serif">
          {ord.map((o, i) => (
            <motion.span key={i} initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: takt >= 1 ? 1 : 0, filter: takt >= 1 ? 'blur(0px)' : 'blur(8px)' }} transition={{ duration: 0.7, delay: takt >= 1 ? 0.9 + i * 0.16 : 0, ease: MYK }}>
              {o}{' '}
            </motion.span>
          ))}
        </p>
        <Inn vis={takt >= 1} d={0.9 + ord.length * 0.16 + 0.3} className="sitat-hvem">
          — Servitør, intervju
        </Inn>
        <div className="sitat-stikkord">
          {['Tilbakemeldinger', 'Gode kolleger', 'Å bli sett'].map((s, i) => (
            <Inn key={s} vis={takt >= 2} d={0.2 + i * 0.3} className="merket">
              {s}
            </Inn>
          ))}
          <Inn vis={takt >= 2} d={1.3} className="sitat-gjester">
            Tilbakemeldinger fra gjester: blant de viktigste motivasjonsfaktorene <span>(samme intervju)</span>
          </Inn>
        </div>
      </div>
    </div>
  )
}

/* ══ 5. Fra foto til data (A) ═══════════════════════════════════════════════════
   Et fotografi av en servitør i arbeid fryses, og innsiktene tegnes rundt personen.
   Ingen målte tall på bildet – bare der tallet er dokumentert, og da merket. */

const MERKELAPPER = [
  { id: 'bevegelse', tekst: 'Bevegelse', farge: 'var(--aktivitet)', dx: -260, dy: -40 },
  { id: 'skritt', tekst: 'Skritt', farge: 'var(--aktivitet)', dx: 230, dy: 10 },
  { id: 'oppgaver', tekst: 'Arbeidsoppgaver', farge: 'var(--papir)', dx: 260, dy: -70 },
  { id: 'salg', tekst: 'Salg', farge: 'var(--salg)', dx: -240, dy: 20 },
  { id: 'anerkjennelse', tekst: 'Anerkjennelse', farge: 'var(--anerkjennelse)', dx: 40, dy: -110 },
] as const

const STANDARDPUNKTER: Record<string, [number, number]> = { bevegelse: [0.42, 0.78], skritt: [0.46, 0.94], oppgaver: [0.62, 0.42], salg: [0.3, 0.5], anerkjennelse: [0.5, 0.2] }
// Hvor de fem merkelappene samles til tre temaer i siste takt
const TEMA_X: Record<string, number> = { anerkjennelse: 560, bevegelse: 960, skritt: 960, oppgaver: 960, salg: 1360 }

export function Innsikter({ takt }: SceneProps) {
  useLys(takt === 3 ? 0.3 : 0)
  const t = useSek()
  const fryst = t > 0.9
  const f = foto('i-arbeid')
  const punkter = { ...STANDARDPUNKTER, ...f.plass.punkter }
  const aktiv = takt === 1 ? ['skritt', 'bevegelse'] : takt === 2 ? ['salg'] : []

  return (
    <div className="scene innsikter">
      <motion.div
        className="innsikt-bilde"
        animate={{ opacity: takt === 3 ? 0 : takt === 0 ? 1 : 0.45, x: takt === 1 || takt === 2 ? -300 : 0, scale: takt === 3 ? 1.08 : 1 }}
        transition={{ duration: 1.4, ease: MYK }}
      >
        <motion.div className="innsikt-frys" animate={{ filter: fryst ? 'saturate(0.35) contrast(1.08)' : 'saturate(1) contrast(1)' }} transition={{ duration: 0.25 }}>
          <Foto id="i-arbeid" kamera={fryst ? 'stille' : 'drift'} tid={12} />
        </motion.div>
        <motion.div className="frys-blink" initial={{ opacity: 0 }} animate={{ opacity: fryst && t < 1.25 ? 0.5 : 0 }} transition={{ duration: 0.12 }} />
        <motion.div className="frys-kode" initial={{ opacity: 0 }} animate={{ opacity: fryst && takt === 0 ? 1 : 0 }}>
          <span className="rec" /> FRYST · 20:47:12
        </motion.div>

        <svg className="merkelapp-linjer" viewBox="0 0 1920 1080" aria-hidden="true">
          {MERKELAPPER.map((m, i) => {
            const [px, py] = punkter[m.id] ?? STANDARDPUNKTER[m.id]
            const x = px * 1920
            const y = py * 1080
            return (
              <motion.g key={m.id} initial={{ opacity: 0 }} animate={{ opacity: fryst && takt < 3 ? (aktiv.length && !aktiv.includes(m.id) ? 0 : 1) : 0 }} transition={{ duration: 0.8, delay: takt === 0 ? 1.3 + i * 0.35 : 0 }}>
                <motion.line x1={x} y1={y} x2={x + m.dx} y2={y + m.dy} stroke={m.farge} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: fryst ? 1 : 0 }} transition={{ duration: 0.7, delay: 1.3 + i * 0.35, ease: MYK }} />
                <circle cx={x} cy={y} r="9" fill={m.farge} />
                <circle cx={x} cy={y} r="22" fill="none" stroke={m.farge} strokeOpacity="0.5" className="puls" />
              </motion.g>
            )
          })}
        </svg>
        {MERKELAPPER.map((m, i) => {
          const [px, py] = punkter[m.id] ?? STANDARDPUNKTER[m.id]
          return (
            <motion.div
              key={m.id}
              className="merkelapp"
              style={{ left: px * 1920 + m.dx, top: py * 1080 + m.dy, color: m.farge }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: fryst && takt < 3 ? (aktiv.length && !aktiv.includes(m.id) ? 0 : 1) : 0, y: 0 }}
              transition={{ duration: 0.8, delay: takt === 0 ? 1.6 + i * 0.35 : 0, ease: MYK }}
            >
              {m.tekst}
            </motion.div>
          )
        })}
      </motion.div>

      <div className="innsikt-kort-plass">
        <Inn vis={takt === 1} d={0.5} className="innsikt-kort">
          <span className="overtittel" style={{ color: 'var(--aktivitet)' }}>
            Innsikt · Skritt og aktivitet
          </span>
          <div className="stort-tall" style={{ color: 'var(--aktivitet)' }}>
            12 000–25 000
          </div>
          <p className="tall-tekst">skritt på en vakt</p>
          <span className="merket illustrasjon">Selvrapportert av én hovmester</span>
          <ul>
            <li>Flere snakket om hvor mye de gikk – og sammenlignet med kolleger og stasjoner</li>
            <li>Bevegelse og høyt tempo ble ofte beskrevet som positivt</li>
            <li>Tunge løft og bæring var det som slet</li>
          </ul>
        </Inn>
        <Inn vis={takt === 2} d={0.5} className="innsikt-kort">
          <span className="overtittel" style={{ color: 'var(--salg)' }}>
            Innsikt · Salgsstatistikk
          </span>
          <div className="stort-tall mindre" style={{ color: 'var(--salg)' }}>
            Kassarapporten etter vakten
          </div>
          <span className="merket observert">Observert – ikke bare fortalt</span>
          <div className="kvittering">
            {['Personlig omsetning', 'Tips', 'Salg sammenlignet med kolleger', 'Personlige rekorder', 'Resultater fra enkeltvakter'].map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: takt === 2 ? 1 : 0, x: 0 }} transition={{ delay: 1 + i * 0.18 }}>
                <span>{l}</span>
                <i />
              </motion.div>
            ))}
          </div>
          <p className="fotnote">Ofte vanskelig å finne igjen etterpå – om man ikke tok vare på rapporten selv.</p>
        </Inn>
      </div>

      <div className="tre-tema">
        {[
          { id: 'anerkjennelse', tekst: 'Anerkjennelse', farge: 'var(--anerkjennelse)' },
          { id: 'bevegelse', tekst: 'Aktivitet', farge: 'var(--aktivitet)' },
          { id: 'salg', tekst: 'Salg', farge: 'var(--salg)' },
        ].map((m, i) => (
          <motion.div
            key={m.id}
            className="tema-node"
            style={{ left: TEMA_X[m.id], color: m.farge }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: takt === 3 ? 1 : 0, scale: takt === 3 ? 1 : 0.4 }}
            transition={{ duration: 1.2, delay: takt === 3 ? 0.5 + i * 0.25 : 0, ease: MYK }}
          >
            <span className="tema-sirkel" />
            <b>{m.tekst}</b>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
