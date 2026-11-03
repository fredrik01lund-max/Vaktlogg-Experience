import { motion } from 'motion/react'
import { foto } from '../lib/foto.ts'
import { oppsett, navn } from '../lib/oppsett.ts'
import { Bong, Klokke, type BongData } from '../ui/Deler.tsx'
import { Foto } from '../ui/Foto.tsx'
import { FILM, Inn, MYK, useLys, useSek, type SceneProps } from './felles.tsx'

/* ══ 1. Restaurantåpningen (stille, 22 s) ════════════════════════════════════════
   Bongene ruller inn på skinnen og vakten tar av – så blir det stille. Ingen tale,
   virker uten lyd. Fotografier fra restauranten blinker forbi bak bongene når de finnes. */

const BONGER: BongData[] = [
  { bord: 'BORD 12', pax: '4 PAX', tid: '17:10', linjer: ['2 × ANDEBRYST', '1 × TORSK', '1 × RISOTTO'], merk: 'ALLERGI: NØTTER' },
  { bord: 'BORD 14', pax: '2 PAX', tid: '17:25', linjer: ['2 × VINMENY'] },
  { bord: 'BORD 11', pax: '6 PAX', tid: '17:40', linjer: ['BURSDAG', 'DESSERT KL 20'] },
  { bord: 'BORD 16', pax: '3 PAX', tid: '18:05', linjer: ['3 × DAGENS'] },
  { bord: 'BORD 13', pax: '2 PAX', tid: '18:30', linjer: ['KOMMER SENT'] },
  { bord: 'BORD 15', pax: '5 PAX', tid: '18:45', linjer: ['2 × TARTAR', '3 × TORSK'], merk: 'GLUTENFRI' },
  { bord: 'BORD 17', pax: '2 PAX', tid: '19:10', linjer: ['REGNINGEN'] },
  { bord: 'BORD 12', tid: '19:40', linjer: ['4 × DESSERT'] },
  { bord: 'BORD 11', tid: '20:15', linjer: ['6 × KAFFE'] },
  { bord: 'BORD 16', tid: '20:30', linjer: ['VENTER PÅ MAT'], merk: 'HASTER' },
  { bord: 'BORD 14', tid: '20:45', linjer: ['EKSTRA BRØD'] },
  { bord: 'BORD 13', tid: '21:05', linjer: ['2 × HOVEDRETT'] },
  { bord: 'BORD 15', tid: '21:30', linjer: ['REGNINGEN'] },
  { bord: 'BORD 17', pax: '4 PAX', tid: '22:10', linjer: ['NYTT BORD'] },
]
// Bongene kommer stadig tettere – kvelden tar av
const ANKOMST = [3.0, 4.5, 5.8, 6.9, 7.8, 8.6, 9.3, 9.9, 10.4, 10.9, 11.35, 11.75, 12.1, 12.45]
const STOPP = 13.6
const ROTASJON = [-2.2, 1.6, -0.8, 2.4, -1.8, 0.9, -2.6, 1.9, -1.2, 2.1, -0.5, 1.3, -2.0, 0.7]
const GLIMT = [
  { id: 'apning-1', fra: 5.2, til: 6.6 },
  { id: 'apning-2', fra: 8.9, til: 10.1 },
  { id: 'apning-3', fra: 11.6, til: 12.6 },
]

export function Apning() {
  const t = useSek()
  useLys(t < 1 ? 0 : t < STOPP ? 0.95 : t < 19.4 ? 0.28 : 0.7)
  const synlige = ANKOMST.filter((a) => t >= a).length
  const stoppet = t >= STOPP
  const sperre = t < 19.4

  return (
    <div className="scene apning">
      {GLIMT.map((g) =>
        foto(g.id).status === 'ok' ? (
          <motion.div key={g.id} className="apning-glimt" initial={{ opacity: 0 }} animate={{ opacity: t >= g.fra && t < g.til ? 0.55 : 0 }} transition={{ duration: 0.35 }}>
            <Foto id={g.id} kamera="inn" tid={4} />
          </motion.div>
        ) : null,
      )}

      <motion.div className="skinne" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: t > 1.2 ? 1 : 0, opacity: t > 1.2 && !(t > 14.5) ? 1 : 0 }} transition={{ duration: 1.6, ease: FILM }} />

      <div className="bongrekke">
        {BONGER.slice(0, synlige).map((b, i) => {
          const fraHoyre = synlige - 1 - i // 0 = nyeste
          const x = 1540 - fraHoyre * 214
          const faller = stoppet
          return (
            <motion.div
              key={i}
              className="bong-holder"
              initial={{ x: 2100, y: 0, rotate: 8, opacity: 1 }}
              animate={
                faller
                  ? { x, y: 760, rotate: ROTASJON[i] * 6, opacity: 0 }
                  : { x, y: 0, rotate: ROTASJON[i], opacity: x < -200 ? 0 : 1 }
              }
              transition={faller ? { duration: 1.1, delay: (i % 5) * 0.08, ease: [0.5, 0, 0.9, 0.4] } : { type: 'spring', stiffness: 120, damping: 17, mass: 0.9 }}
            >
              <Bong b={b} />
            </motion.div>
          )
        })}
      </div>

      <motion.div className="apning-klokke" initial={{ opacity: 0 }} animate={{ opacity: t > 2.2 && t < 19.2 ? 1 : 0 }} transition={{ duration: 0.8 }}>
        <span className="overtittel">Fredag · Brasserie Fjordgata</span>
        <Klokke fra={16 * 60} til={23 * 60 + 30} sek={STOPP - 2.6} start={t > 2.6} />
      </motion.div>

      <Inn vis={t > 14.9 && t < 17.1} className="apning-linje stor-serif" tid={1.2}>
        Vakten er over.
      </Inn>
      <Inn vis={t > 17.3 && t < 19.4} className="apning-linje stor-serif kursiv" tid={1.2}>
        Hva sitter hun igjen med?
      </Inn>

      <Tittel vis={t > 19.7} />

      {/* Filmformat (2,39:1) til tittelen kommer */}
      <motion.div className="sperre topp" initial={{ height: 138 }} animate={{ height: sperre ? 138 : 0 }} transition={{ duration: 1.8, ease: FILM }} />
      <motion.div className="sperre bunn" initial={{ height: 138 }} animate={{ height: sperre ? 138 : 0 }} transition={{ duration: 1.8, ease: FILM }} />
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

/* ══ 2. Behind the shift – åpning og utgangspunkt (A) ═══════════════════════════ */

export function TittelScene({ takt }: SceneProps) {
  useLys(takt === 0 ? 0.7 : 0.35)
  return (
    <div className="scene tittel-scene">
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
        <div className="utgangspunkt-trekk">
          {['Knapp bemanning', 'Små marginer', 'Fysisk krevende arbeidsdager'].map((s, i) => (
            <Inn key={s} vis={takt >= 1} d={1.2 + i * 0.35} className="merket">
              {s}
            </Inn>
          ))}
        </div>
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
