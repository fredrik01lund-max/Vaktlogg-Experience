import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { manus } from '../content/manus.ts'
import { filmUrl } from '../lib/film.ts'
import frys from '../lib/frys.json'
import { hent, neste } from '../lib/sync.ts'
import { oppsett } from '../lib/oppsett.ts'
import { Apning, TittelScene } from './Del1.tsx'
import { Ide, ToInnsikter, VALG } from './Del2.tsx'
import { Inn, MYK, useLys, useSek, type SceneProps } from './felles.tsx'

/* ══ Den nye flyten (nattøkta 3.–4.11) ═══════════════════════════════════════════
   Ti scener i stedet for fjorten. Noen scener er sammensatt av de gamle (åpning + tittel, idé + merket),
   andre er nye og bygd på rutenettet i system.css: tekst til venstre (kolonne 1–7), objekt til høyre (8–12),
   overskrift fra y = 216, merking nede til venstre. De gamle scenene ligger urørt i arkivet. */

/** Viser én av flere deler etter hverandre i samme scene, med en rolig overtoning mellom dem. */
function Del({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="sync">
      <motion.div key={id} style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: MYK }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ── 1. Vakten: åpningsfilmen, så tittelen og utgangspunktet ── */
export function Vakten({ takt, valg }: SceneProps) {
  return <Del id={takt === 0 ? 'film' : 'tittel'}>{takt === 0 ? <Apning /> : <TittelScene takt={takt - 1} valg={valg} />}</Del>
}

/* ── 2. Hvem vi snakket med: kildene, spørsmålet som ga mest, og sitatet ── */
const GUIDE: [number, string][] = [
  [10, 'Hva skal til for at en travel vakt blir en god vakt i stedet for en jævlig en?'],
  [11, 'Hvordan vil du beskrive hvor mye du er i bevegelse på en vanlig vakt?'],
  [15, 'Fortell om en vakt der du var mye i farta, men likevel gikk hjem i godt humør. Hva skjedde?'],
  [16, 'Fortell om en vakt der du var like mye i farta, men gikk hjem helt tom. Hva var forskjellen?'],
]

export function Folk({ takt }: SceneProps) {
  useLys(0)
  const n = oppsett.innsikt.transkriberteIntervjuer
  const kilder: [string, string][] = [
    ['Intervjuer', n ? `${n} er transkribert, ikke alle` : 'Noen er transkribert, ikke alle'],
    ['Samtaler', 'Uformelle samtaler med ansatte i bransjen'],
    ['Observasjoner', `Servitører i jobb, blant annet på ${oppsett.innsikt.observasjonssteder.join(' og ')}`],
    ['Egen erfaring', 'Servitør, hovmester og daglig leder'],
  ]
  return (
    <div className="scene folk">
      <div className="rute folk-venstre">
        <Inn vis={takt === 0}>
          <h2 className="h2">Hvem vi snakket med</h2>
          <table className="kildetabell">
            <tbody>
              {kilder.map(([navn, tekst]) => (
                <tr key={navn}>
                  <th>{navn}</th>
                  <td>{tekst}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="liten folk-briller">Bakgrunnen vår gjorde det lettere å komme inn, men vi ser også lett det vi kjenner fra før.</p>
        </Inn>

        <Inn vis={takt === 1} className="folk-sporsmal">
          <p className="liten">Spørsmål 10 i intervjuguiden</p>
          <p className="folk-sporsmal-tekst">Hva skal til for at en travel vakt blir en god vakt i stedet for en jævlig en?</p>
          <p className="tekst folk-svar">Svarene handlet mest om nok folk på jobb, en god plan og arbeidsmiljøet.</p>
        </Inn>

        <Inn vis={takt === 2} className="folk-sitat">
          <blockquote>«Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.»</blockquote>
          <div className="stempel-rad folk-hvem">
            <span>Servitør, svar på spørsmål 28</span>
            <span className="merket">Språklig bearbeidet</span>
          </div>
          <p className="ingress folk-gjester">I den siste jobben var det bare gjestene som motiverte henne.</p>
        </Inn>
      </div>

      {/* Et ekte arbeidsdokument: utdrag fra intervjuguiden, ordrett */}
      <motion.div className="guide-ark" initial={{ opacity: 0, y: 20, rotate: -1.6 }} animate={{ opacity: takt <= 1 ? 1 : 0, y: takt <= 1 ? 0 : 20, rotate: -1.6 }} transition={{ duration: 0.7, ease: MYK }}>
        <div className="guide-hode">
          <b>Intervjuguide</b>
          <span>Del 3–4 · utdrag</span>
        </div>
        <ol>
          {GUIDE.map(([nr, sp]) => (
            <li key={nr} className={takt === 1 && nr === 10 ? 'merket-linje' : ''}>
              <span>{nr}</span>
              {sp}
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  )
}

/* ── 3. Nøkkelfunn: et frosset bilde fra vakten, og de tre tingene som gikk igjen ──
   Bildet er fra åpningsfilmen (en stilisert figur uten ansikt), så det er tydelig at det er en illustrasjon. */
const FUNN = [
  { id: 'bevegelse', punkt: 'servitor', farge: 'var(--aktivitet)' },
  { id: 'salg', punkt: 'bar', farge: 'var(--salg)' },
  { id: 'anerkjennelse', punkt: 'gjester', farge: 'var(--anerkjennelse)' },
] as const
const FORSKYV = 170 // bildet er skjøvet til høyre, så kortet til venstre ikke dekker servitøren

export function Funn({ takt }: SceneProps) {
  useLys(0)
  const p = frys.punkter as unknown as Record<string, [number, number]>
  return (
    <div className="scene funn">
      <motion.img className="funn-bilde" src={frys.bilde} alt="" style={{ x: FORSKYV }} animate={{ opacity: takt === 2 ? 0 : 1 }} transition={{ duration: 1.2 }} />
      <motion.img className="funn-bilde" src="film/apning-slutt.png" alt="" style={{ x: FORSKYV }} initial={{ opacity: 0 }} animate={{ opacity: takt === 2 ? 1 : 0 }} transition={{ duration: 1.6 }} />
      <div className="funn-skygge" />

      {FUNN.map((f, i) => {
        const [px, py] = p[f.punkt]
        const vis = i === takt && takt < 2
        const x = px * 1920 + FORSKYV
        // Nær høyrekanten står merkelappen til venstre for punktet, ellers havner den utenfor bildet
        const plass = x > 1500 ? { right: 1920 - x, top: py * 1080 } : { left: x, top: py * 1080 }
        return (
          <motion.div key={f.id} className={`funn-punkt ${x > 1500 ? 'mot-venstre' : ''}`} style={{ ...plass, color: f.farge }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: vis ? 1 : 0, scale: vis ? 1 : 0.6 }} transition={{ duration: 0.5, delay: vis ? 0.4 : 0, ease: MYK }}>
            <i />
            <span>{f.id === 'bevegelse' ? 'Bevegelse' : f.id === 'salg' ? 'Salg' : 'Anerkjennelse'}</span>
          </motion.div>
        )
      })}
      <div className="funn-merk">
        <span className="merket illustrasjon">Illustrasjon</span>
      </div>

      <div className="funn-kort">
        <span className="funn-nr">{Math.min(takt, 2) + 1} av 3</span>
        <AnimatePresence mode="wait">
          {takt === 0 && (
            <motion.div key="0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="h2">Bevegelse</h2>
              <p className="tekst">Flere svarte i skritt da vi spurte hvor mye de var i farta.</p>
              <div className="funn-tall">
                <b>12 000–15 000</b> skritt på en kort vakt
                <br />
                <b>opptil 25 000</b> på en lang
              </div>
              <div className="stempel-rad">
                <span className="merket">Selvrapportert</span>
                <span className="liten">én hovmester</span>
              </div>
              <p className="tekst funn-etter">Farten var ofte positiv. Det som slet, var tunge løft.</p>
            </motion.div>
          )}
          {takt === 1 && (
            <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="h2">Salg</h2>
              <p className="tekst">Vi så ansatte sjekke kassarapporten etter vakten.</p>
              <div className="stempel-rad">
                <span className="merket observert">Observert</span>
              </div>
            </motion.div>
          )}
          {takt >= 2 && (
            <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="h2">Anerkjennelse</h2>
              <p className="tekst">Fra gjester, kolleger og ledere.</p>
              <div className="stempel-rad">
                <span className="merket">Fortalt</span>
              </div>
              <p className="funn-tomt">Etter vakten blir lite av innsatsen synlig. Kassarapporten er nesten det eneste.</p>
              <div className="stempel-rad">
                <span className="merket illustrasjon">Vår tolkning</span>
              </div>
              <ul className="funn-tre">
                <li style={{ color: 'var(--aktivitet)' }}>Bevegelse</li>
                <li style={{ color: 'var(--salg)' }}>Salg</li>
                <li style={{ color: 'var(--anerkjennelse)' }}>Anerkjennelse</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── 5. Fra Strava til Vaktlogg: ideen, historien, merket – og beslutningen om rettferdighet ── */
export function Valg({ takt, valg }: SceneProps) {
  const del = takt <= 1 ? 'ide' : takt <= 3 ? 'merke' : 'beslutning'
  return (
    <Del id={del}>
      {del === 'ide' ? <Ide takt={takt} valg={valg} /> : del === 'merke' ? <ToInnsikter takt={takt - 2} valg={valg} /> : <Beslutning />}
    </Del>
  )
}

function Beslutning() {
  useLys(0)
  const t = useSek()
  const stryk = t > 2.2
  return (
    <div className="scene beslutning">
      <div className="rute">
        <p className="liten">Designvalg</p>
        <h2 className="h2">Hvordan blir en konkurranse rettferdig når folk har ulike stasjoner?</h2>
      </div>
      <ol className="valg-alternativer">
        {VALG.map((v, i) => {
          const bort = i < 2
          const valgt = i === 2
          return (
            <motion.li key={v.tekst} className={`${bort && stryk ? 'bort' : ''} ${valgt && stryk ? 'valgt' : ''}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: bort && stryk ? 0.45 : 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.25, ease: MYK }}>
              <span className="valg-tekst">
                {v.tekst}
                {bort && <motion.i className="strek" initial={{ scaleX: 0 }} animate={{ scaleX: stryk ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.3, ease: MYK }} />}
              </span>
              <small>{i === 0 ? 'Den beste stasjonen vinner nesten uansett.' : i === 1 ? 'Belønner å slite seg ut.' : i === 2 ? 'Det er fremgangen som teller.' : 'Rolig modus: det er lov å stå utenfor.'}</small>
            </motion.li>
          )
        })}
      </ol>
      <motion.div className="valg-vin" initial={{ opacity: 0 }} animate={{ opacity: t > 3.4 ? 1 : 0 }} transition={{ duration: 0.6 }}>
        <span className="merket">Designprinsipp</span>
        <p className="ingress">Ingen konkurranser om alkohol</p>
        <p className="liten">selv om historien som startet ideen, handlet om vin</p>
      </motion.div>
    </div>
  )
}

/* ── 6. Det vi prioriterte: innsikt → funksjon, med ekte skjermbilder fra prototypen ── */
const PAR = [
  { fra: 'Kassarapporten etter vakten', merke: 'Observert', til: 'Salg, mens du jobber', skjerm: 'salg' },
  { fra: 'Skrittene de fortalte om', merke: 'Selvrapportert', til: 'Helse, bare for deg', skjerm: 'helse' },
  { fra: 'Hjelpen til kolleger, som ikke synes i kassen', merke: 'Fortalt', til: 'Kudos og takkekort', skjerm: 'live' },
  { fra: 'Tiden etter vakten', merke: 'Vår tolkning', til: 'Sluttrapporten', skjerm: 'rapport' },
]

/** Først Blender-filmen «Alt vi pakket inn» (takt 0): skjermbildene flyr inn i telefonen. Den går videre av seg selv
 *  når den er ferdig, og B forteller hvilket funn som ble hvilken funksjon (takt 1–2). */
export function Prioritert({ takt }: SceneProps) {
  useLys(0)
  const video = useRef<HTMLVideoElement>(null)
  const [filmFeil, setFilmFeil] = useState(false)

  useEffect(() => {
    if (takt !== 0) return
    const v = video.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => setFilmFeil(true))
  }, [takt])

  const ferdig = () => {
    const n = hent()
    if (manus[n.scene]?.id === 'prioritert' && n.takt === 0) neste()
  }
  // Mangler filmen, går scenen videre med en gang, så B aldri står og venter
  useEffect(() => {
    if (!filmFeil || takt !== 0) return
    const id = window.setTimeout(ferdig, 1500)
    return () => clearTimeout(id)
  }, [filmFeil, takt])

  return (
    <div className="scene prioritert">
      {takt >= 1 && <PrioritertInnhold b={takt - 1} />}
      <motion.video
        ref={video}
        className="prioritert-film"
        src={filmUrl('pakket')}
        muted
        playsInline
        preload="auto"
        onEnded={ferdig}
        onError={() => setFilmFeil(true)}
        initial={false}
        animate={{ opacity: takt === 0 && !filmFeil ? 1 : 0 }}
        transition={{ duration: 0.9, ease: MYK }}
      />
    </div>
  )
}

function PrioritertInnhold({ b }: { b: number }) {
  const t = useSek()
  // Telefonen viser funksjonen som nettopp er nevnt (omtrent i takt med replikken), og lederens visning til slutt
  const aktiv = b === 0 ? Math.min(PAR.length - 1, Math.floor(Math.max(0, t - 2) / 3.6)) : -1
  const skjerm = b === 0 ? PAR[aktiv].skjerm : 'sjef'
  const takt = b
  return (
    <>
      <div className="rute prioritert-venstre">
        <h2 className="h2">Det vi prioriterte</h2>
        <ol className="par-liste">
          {PAR.map((p, i) => (
            <motion.li key={p.til} className={i === aktiv ? 'na' : ''} initial={{ opacity: 0, y: 8 }} animate={{ opacity: takt === 0 ? (i <= aktiv ? 1 : 0.35) : 0.35, y: 0 }} transition={{ duration: 0.5, delay: takt === 0 ? 0.3 + i * 0.1 : 0, ease: MYK }}>
              <span className="par-fra">
                {p.fra} <span className="merket">{p.merke}</span>
              </span>
              <span className="par-til">{p.til}</span>
            </motion.li>
          ))}
        </ol>
        <Inn vis={takt >= 1} className="prioritert-ogsa">
          <p className="tekst">Med som tillegg: mål og premier, personalmenyen og oversikten over gjester og bord.</p>
          <p className="ingress prioritert-leder">Lederen ser bare laget, aldri tall per person.</p>
        </Inn>
      </div>
      <div className="prioritert-telefon">
        <AnimatePresence mode="sync">
          <motion.img key={skjerm} src={`skjerm/${skjerm}.png`} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} />
        </AnimatePresence>
      </div>
      {/* Bildetekst under telefonen (den gjelder skjermbildene), så den ikke kolliderer med lederlinjen */}
      <p className="kilde-linje prioritert-kilde">Ekte skjermbilder fra prototypen. Fiktiv restaurant, simulerte tall.</p>
    </>
  )
}

/* ── 9. Hva vi vet, og hva nå ── */
const KOLONNER = [
  { over: 'Det vi vet', linjer: ['Ansatte som sjekker kassarapporten etter vakten', 'Ansatte som forteller om skrittene sine'] },
  { over: 'Det vi tror', linjer: ['Å se sin egen innsats, og bli sett for den, kan gi mer motivasjon', 'Konkurranser motiverer noen, ikke alle'] },
  { over: 'Det vi må teste', linjer: ['Åpner noen appen etter vakten, med sine egne tall?', 'Opplever de mer motivasjon over tid?'] },
]
const SVAKHETER = ['Bevegelse var et kjernetema i guiden, så skrittene er delvis noe vi spurte etter', 'Sitatet, vinhistorien og sykdomseksempelet kommer fra samme intervju', 'Positive tilbakemeldinger kan være høflighet', 'Noen spørsmål var ledende']
const SPORSMAL = ['Oppleves det rettferdig å måles mot sin egen vanlige kveld?', 'Oppleves det som kontroll, selv om lederen bare ser laget?', 'Får vi data fra kassasystemet?', 'Hvem skal betale?']

export function Vet({ takt }: SceneProps) {
  useLys(0)
  return (
    <div className="scene vet">
      <motion.div className="vet-tre" animate={{ opacity: takt <= 1 ? 1 : 0, y: takt <= 1 ? 0 : -16 }} transition={{ duration: 0.5, ease: MYK }}>
        {KOLONNER.map((k, i) => (
          <Inn key={k.over} d={0.15 + i * 0.25} className="vet-kolonne">
            <h3>{k.over}</h3>
            {k.linjer.map((l) => (
              <p key={l} className="tekst">
                {l}
              </p>
            ))}
          </Inn>
        ))}
      </motion.div>
      <Inn vis={takt === 1} className="vet-svakheter">
        <h3>Svakheter i materialet</h3>
        <ol>
          {SVAKHETER.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Inn>
      <Inn vis={takt >= 2} className="vet-videre">
        <h2 className="h2">Før vi bygger mer: det en pilot skal svare på</h2>
        <ol>
          {SPORSMAL.map((s) => (
            <li key={s} className="ingress">
              {s}
            </li>
          ))}
        </ol>
        <div className="vet-pilot">
          <span className="merket illustrasjon">Mulig neste steg</span>
          <p className="ingress">En liten pilot med én restaurant, med ekte data og over tid.</p>
        </div>
      </Inn>
    </div>
  )
}
