import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { filmUrl } from '../lib/film.ts'
import ringer from '../lib/ringer.json'
import apningMeta from '../lib/apning.json'
import intervju from '../lib/intervju2.json'
import kassaMeta from '../lib/kassa.json'
import reise from '../lib/reise.json'
import { manus } from '../content/manus.ts'
import { Flipp } from '../ui/Deler.tsx'
import { Foto } from '../ui/Foto.tsx'
import { foto as hentFoto } from '../lib/foto.ts'
import kilder from '../lib/kilder.json'
import { Inn, MYK, settIkonSkjult, Studio, useLys, useSek, type SceneProps } from './felles.tsx'

/* ══ Manus v2 (8.11) ════════════════════════════════════════════════════════════════
   Én tydelig grafikk per scene, høyst 8 synlige ord (npm run sjekk-tekst). Det som sies, står ikke på skjermen.
   Diamanten i hjørnet og overgangene ligger i ui/Diamant.tsx og styres fra salen. */

/* ── 1. Problemområdet (A, før diamanten) ──
   Åpningen (Blender, ringer-* i hopping_spor.py): svart, den rosa kula faller ned der flipptavla skal stå, og ringer
   av lys brer seg utover – ringvirkninger, det A snakker om. I treffet slår tavla seg opp bokstav for bokstav til
   SYKEFRAVÆR. Kula spretter videre i en bue og legger seg der startpunktet i diamant-ikonet står, og ikonet tones inn
   rundt den. Filmen tones bort mot svart, og linjen kommer. Samme tavle snur i del 4 og kommer tilbake i del 9.
   1 + 4 ord. */
export function Problem(_: SceneProps) {
  useLys(0)
  const video = useRef<HTMLVideoElement>(null)
  const [t, setT] = useState(0)
  const [ferdig, setFerdig] = useState(false)

  useEffect(() => {
    const v = video.current
    settIkonSkjult(true)
    let id = 0
    const tikk = () => {
      if (v) setT(v.currentTime)
      id = requestAnimationFrame(tikk)
    }
    if (v) {
      v.currentTime = 0
      v.play().catch(() => setFerdig(true))
      id = requestAnimationFrame(tikk)
    }
    return () => {
      cancelAnimationFrame(id)
      settIkonSkjult(false)
    }
  }, [])
  // Ikonet kommer når kula er på plass (eller med en gang hvis filmen ikke kan spilles)
  useEffect(() => {
    if (ferdig || t >= ringer.ikon - 0.25) settIkonSkjult(false)
  }, [t, ferdig])

  const tavle = ferdig || t >= ringer.treff - 0.05
  const tonUt = ferdig || t >= ringer.varighet - 0.7
  return (
    <div className="scene v2 ps">
      <Studio vis={tonUt} fase="noytral" />
      <motion.video
        ref={video}
        className="pr-film"
        src={filmUrl('ringer')}
        muted
        playsInline
        preload="auto"
        onEnded={() => setFerdig(true)}
        onError={() => setFerdig(true)}
        initial={false}
        animate={{ opacity: tonUt ? 0 : 1 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
      <div className="ps-midt">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: tavle ? 1 : 0, scale: tavle ? 1 : 0.96 }} transition={{ duration: 0.45, ease: MYK }}>
          <Flipp fra="          " til="SYKEFRAVÆR" start={tavle} />
        </motion.div>
        <Inn vis={tonUt} d={tonUt && !ferdig ? 0.4 : 0} className="pr-linje stor-serif">
          Opplevd på nært hold
        </Inn>
      </div>
    </div>
  )
}

/* ── 2. Innsiktsarbeidet (A, Empathize) ──
   Én bong per intervju, skrevet ut én etter én og hengt på bongskinna som på kjøkkenet: rollen står på bongen,
   fargen viser rollen, så sensor ser hvem vi snakket med uten at vi skriver «10 intervjuer». Til slutt en bong i
   annet papir: vår egen erfaring. Under skinna fem ekte bilder fra Noode Sky og Park 29 (INNSIKT_BILDER, plassene
   i public/foto/foto.js). Ord: SERVITØR, HOVMESTER, DAGLIG LEDER, EGEN ERFARING,
   Observasjon og Empathize = 8, pluss INNSIKT på knaggen og INTERVJU på bongene = 10 (brukeren ba om begge 9.11,
   unntak i scripts/sjekk-tekst.ts). Bongene henges opp én etter én, tettere og tettere som bestillinger på et kjøkken,
   og faller av knaggen når C/A klikker videre (exit-animasjon; salen venter litt med neste scene).
   Bongene henger i grupper, én gruppe per restaurant (seks steder), med luft imellom – uten navn og uten tall, så
   informantene er anonyme og ordene ikke blir flere. «sted» brukes bare til grupperingen (navnene står her i koden,
   aldri på skjermen): 1 Frenchie, 2 Noode Sky, 3 Park 29, 4 Olivia, 5 Den glade gris, 6 en restaurant i Drammen. */
type Intervju = { rolle: 'SERVITØR' | 'HOVMESTER' | 'DAGLIG LEDER'; sted: number }
const INTERVJUER: Intervju[] = [
  { rolle: 'SERVITØR', sted: 1 },
  { rolle: 'SERVITØR', sted: 1 },
  { rolle: 'SERVITØR', sted: 2 },
  { rolle: 'SERVITØR', sted: 2 },
  { rolle: 'DAGLIG LEDER', sted: 2 },
  { rolle: 'DAGLIG LEDER', sted: 3 },
  { rolle: 'HOVMESTER', sted: 4 },
  { rolle: 'HOVMESTER', sted: 5 },
  { rolle: 'SERVITØR', sted: 6 },
  { rolle: 'SERVITØR', sted: 6 },
]
const ROLLEFARGE: Record<Intervju['rolle'], string> = { SERVITØR: '#F08FB0', HOVMESTER: '#A8E6DA', 'DAGLIG LEDER': '#FFD9B3' }
// Når hver bong henges opp: som bestillinger i en travel kveld – først rolig, så tettere og tettere (9.11)
const BONG_TID = (() => {
  const t = [1.0]
  for (let i = 1; i < INTERVJUER.length; i++) t.push(t[i - 1] + 0.62 - (0.44 * (i - 1)) / (INTERVJUER.length - 2))
  t.push(t[t.length - 1] + 0.7) // egen erfaring til slutt, litt etter
  return t
})()
const BONG_SLUTT = BONG_TID[BONG_TID.length - 1] + 0.4
// Bildene fra stedene vi besøkte (9.11): Park 29 og Noode Sky, blandet så de ligger som en bunke på bordet.
// Ingen stedsnavn på skjermen. innsikt-2 (servitør vi intervjuet) mangler fortsatt og vises ikke.
const INNSIKT_BILDER = [
  { id: 'innsikt-park29-1', r: -4 },
  { id: 'innsikt-1', r: 2.5 },
  { id: 'innsikt-noode-2', r: -2 },
  { id: 'innsikt-park29-2', r: 3.5 },
  { id: 'innsikt-noode-3', r: -3 },
]

export function Innsikt(_: SceneProps) {
  useLys(0)
  const bonger = [...INTERVJUER.map((iv) => ({ ...iv, egen: false })), { rolle: 'EGEN ERFARING', sted: 0, egen: true }]
  return (
    <div className="scene v2 in">
      <Studio fase="mint" />
      <motion.div className="skinne in-skinne" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: MYK }} />
      {/* Skiltet på knaggen: dette er innsiktsknaggen, som bongskinnen på et kjøkken */}
      <motion.div className="in-knagg-navn" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6, ease: MYK }}>
        INNSIKT
      </motion.div>
      <div className="in-bonger">
        {bonger.map((b, i) => {
          const d = BONG_TID[i]
          const r = ((i * 37) % 7) - 3
          return (
            <motion.div
              key={i}
              className={`in-bong ${b.egen ? 'egen' : ''} ${i > 0 && !b.egen && b.sted !== bonger[i - 1].sted ? 'nytt-sted' : ''}`}
              style={{ ['--rolle' as string]: b.egen ? '#4A4440' : ROLLEFARGE[b.rolle as Intervju['rolle']] }}
              // Henges opp på knaggen som en bestilling: dyttes inn ovenfra, svinger litt og blir hengende
              initial={{ opacity: 0, y: -90, x: 26, rotate: r + 14 }}
              animate={{ opacity: 1, y: 0, x: 0, rotate: [r + 14, r - 7, r + 3.5, r - 1.2, r] }}
              transition={{ duration: 1.0, delay: d, ease: 'easeOut', opacity: { duration: 0.15, delay: d }, y: { duration: 0.32, delay: d, ease: [0.2, 0, 0.3, 1] }, x: { duration: 0.32, delay: d, ease: [0.2, 0, 0.3, 1] } }}
              // Neste side: bongene faller av knaggen
              exit={{ y: 980, rotate: r + (i % 2 ? 26 : -22), x: (i % 3) * 14 - 14, transition: { duration: 0.75, delay: ((i * 5) % 7) * 0.035, ease: [0.55, 0, 1, 0.5] } }}
            >
              <span className="in-klype" />
              {!b.egen && <small>INTERVJU</small>}
              <b>{b.rolle}</b>
            </motion.div>
          )
        })}
      </div>
      {INNSIKT_BILDER.map((b, i) => (
        <motion.div
          key={b.id}
          className={`in-bilde in-b${i + 1}`}
          initial={{ opacity: 0, y: 50, rotate: b.r * 2 }}
          animate={{ opacity: 1, y: 0, rotate: b.r }}
          exit={{ opacity: 0, y: 40, transition: { duration: 0.5 } }}
          transition={{ duration: 1.2, delay: BONG_SLUTT + 0.3 + i * 0.22, ease: MYK }}
        >
          <Foto id={b.id} kamera="drift" tid={22 + i * 2} />
          {i === 0 && (
            <span className="in-merke">
              <svg viewBox="0 0 34 34">
                <path d="M2.5 17S8 8 17 8s14.5 9 14.5 9-5.5 9-14.5 9S2.5 17 2.5 17z M17 13a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" />
              </svg>
              Observasjon
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ── 3. Nøkkelfunn (A, Empathize): tre klipp fra den samme restauranten ──
   Klippene er laget for å settes sammen til brukerreisen i del 5 senere.
   1 Bevegelse: den originale åpningsfilmen – Emma går gjennom kvelden og sporet vokser bak henne – med en skritteller
     som går til 15 000 i takt med vakten (apning.json: vaktStart → vaktSlutt).
   2 Salg: tre servitører ved disken etter stengetid sammenligner kassarapportene (Emmas kan leses over skulderen,
     tenkte tall), krøller dem, kaster dem i bøtta og går ut mens lysene slukkes (Blender, kassa-*). «Illustrasjon».
   3 Det som lå under: Emma blir intervjuet ved et vindusbord (Blender, blender/intervju2.py), og sitatet kommer i en
     snakkeboble ved henne, ord for ord. Sitatet er ordrett fra manuset. Kildelinjen under («språklig bearbeidet …
     illustrasjon») er tatt bort (10.11, brukeren: unødvendig).
   Ord: «15 000», «skritt», «Puls», «Stress» og «Empathize» = 5 (sitatet telles ikke; teksten på lappen i filmen er
   en del av bildet). */
// Skritt på en vakt, fra et av intervjuene
const SKRITT = 15000
// Puls og stress gjennom vakten (11.11): to målere under skrittelleren som går opp og ned mens Emma går gjennom
// kvelden. Nivå 0–1 etter hvor langt vakten er kommet. Ingen tall – det er en illustrasjon av at kroppen
// svinger i løpet av en vakt, ikke målinger.
const PULS_FORLOP: [number, number][] = [[0, 0.3], [0.08, 0.5], [0.2, 0.66], [0.32, 0.52], [0.45, 0.84], [0.55, 0.93], [0.66, 0.68], [0.77, 0.88], [0.9, 0.58], [1, 0.36]]
const STRESS_FORLOP: [number, number][] = [[0, 0.14], [0.1, 0.24], [0.24, 0.5], [0.36, 0.36], [0.5, 0.8], [0.6, 0.9], [0.7, 0.56], [0.8, 0.76], [0.92, 0.4], [1, 0.18]]
function niva(forlop: [number, number][], u: number) {
  for (let i = 1; i < forlop.length; i++) {
    const [u0, v0] = forlop[i - 1]
    const [u1, v1] = forlop[i]
    if (u <= u1) {
      const k = Math.min(1, Math.max(0, (u - u0) / Math.max(0.001, u1 - u0)))
      return v0 + (v1 - v0) * k * k * (3 - 2 * k)
    }
  }
  return forlop[forlop.length - 1][1]
}
const SITAT = 'Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.'

// Tegnene for funnene (24 × 24): de samme i Nøkkelfunn og på ringene i Ideate, så sensor ser hva ideen kobler
type Merke = 'skritt' | 'salg' | 'sitat'
const FUNN_MERKER: Merke[] = ['skritt', 'salg', 'sitat']
function MerkeTegn({ type }: { type: Merke }) {
  if (type === 'salg')
    return (
      <>
        <path d="M6 2.5h12v19l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" className="merke-tegn" />
        <path d="M9 7.5h6M9 11.5h6M9 15.5h3.5" className="merke-tegn" />
      </>
    )
  if (type === 'skritt')
    return (
      <g className="merke-tegn fylt">
        <ellipse cx="8.4" cy="7.6" rx="2.7" ry="4.2" />
        <ellipse cx="8.4" cy="14.9" rx="2.1" ry="2.3" />
        <ellipse cx="15.6" cy="10.4" rx="2.7" ry="4.2" />
        <ellipse cx="15.6" cy="17.7" rx="2.1" ry="2.3" />
      </g>
    )
  return <path d="M4 5.5h16v10H11l-4.5 4v-4H4z" className="merke-tegn" />
}

function useFilm(aktiv: boolean) {
  const ref = useRef<HTMLVideoElement>(null)
  const [t, setT] = useState(0)
  useEffect(() => {
    const v = ref.current
    if (!v || !aktiv) return
    v.currentTime = 0
    v.play().catch(() => {})
    let id = 0
    const tikk = () => {
      setT(v.currentTime)
      id = requestAnimationFrame(tikk)
    }
    id = requestAnimationFrame(tikk)
    return () => cancelAnimationFrame(id)
  }, [aktiv])
  return { ref, t }
}

export function Funn({ takt }: SceneProps) {
  useLys(0)
  const a = useFilm(takt === 0)
  const k = useFilm(takt === 1)
  const iv = useFilm(takt === 2)
  const andel = Math.min(1, Math.max(0, (a.t - apningMeta.vaktStart) / (apningMeta.vaktSlutt - apningMeta.vaktStart)))
  const antall = Math.round((andel * SKRITT) / 50) * 50
  // Pulsen flimrer litt rundt nivået sitt (som en måler som leser av), stresset beveger seg roligere
  const puls = Math.min(1, niva(PULS_FORLOP, andel) + (andel > 0 && andel < 1 ? 0.025 * Math.sin(a.t * 7.3) : 0))
  const stress = niva(STRESS_FORLOP, andel)
  const ord = SITAT.split(' ')
  const [hx, hy] = intervju.hode
  return (
    <div className="scene v2 fu">
      <motion.video ref={a.ref} className="fu-film" src={filmUrl('apning')} muted playsInline preload="auto" initial={false} animate={{ opacity: takt === 0 ? 1 : 0 }} transition={{ duration: 0.9 }} />
      <motion.video ref={k.ref} className="fu-film" src={filmUrl('kassa')} muted playsInline preload="auto" initial={false} animate={{ opacity: takt === 1 ? 1 : 0 }} transition={{ duration: 0.9 }} />
      <motion.video ref={iv.ref} className="fu-film" src={filmUrl('intervju')} muted playsInline preload="auto" initial={false} animate={{ opacity: takt === 2 ? 1 : 0 }} transition={{ duration: 0.9 }} />

      {/* «Tre ting gikk igjen»: tre merker viser hvilket av funnene vi er på (ingen ord) – fotspor (bevegelse),
          kassalapp (salg) og snakkeboble (sitatet). De to første kommer igjen på ringene i Ideate. */}
      <div className="fu-prikker" aria-hidden="true">
        {FUNN_MERKER.map((m, i) => (
          <motion.span key={m} className={`m-${m} ${i === takt ? 'na' : i < takt ? 'ferdig' : ''}`} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: i === takt ? 1 : 0.74 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: MYK }}>
            <svg viewBox="0 0 24 24">
              <MerkeTegn type={m} />
            </svg>
          </motion.span>
        ))}
      </div>

      <motion.div className="fu-teller" initial={false} animate={{ opacity: takt === 0 ? 1 : 0 }} transition={{ duration: 0.6 }}>
        <div className="fu-skritt">
          <b data-ord={SKRITT.toLocaleString('nb-NO')}>{antall.toLocaleString('nb-NO')}</b>
          <span>skritt</span>
        </div>
        <div className="fu-maaler puls">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.4c0 5.5-7.5 10.1-7.5 10.1z" />
          </svg>
          <span>Puls</span>
          <i>
            <u style={{ width: `${puls * 100}%` }} />
          </i>
        </div>
        <div className="fu-maaler stress">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 13h4l2-6 3.5 11 3-8 1.5 3h5" />
          </svg>
          <span>Stress</span>
          <i>
            <u style={{ width: `${stress * 100}%` }} />
          </i>
        </div>
      </motion.div>

      {takt === 2 && (
        <>
          <motion.div
            className="fu-boble"
            data-tekst="sitat"
            style={{ left: hx * 1920 + 70, top: Math.max(60, hy * 1080 - 150) }}
            initial={{ opacity: 0, scale: 0.85, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.8, ease: MYK }}
          >
            {ord.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 2.2 + i * 0.32 }}>
                {i === 0 ? '«' : ''}
                {w}
                {i === ord.length - 1 ? '»' : ''}{' '}
              </motion.span>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}

/* ── 5. Brukerreisen (stille film, Define) ──
   En brukerreise etter vanlige regler i Design Thinking: én persona (Emma, tenkt vakt), fire faser, det hun gjør og
   møter (stempelklokka, bordene, gjestene, kollegene, kassarapporten) og en følelseskurve med smertepunkter og
   lyspunkter. Tre klipp etter hverandre fra samme restaurant (Blender):
     reise.mp4  før og under vakten – humøret vises også i lysringen under Emma (korall tungt, gull/mint godt)
     kassa.mp4  etter vakten – kassarapportene sammenlignes, krølles, kastes; lysene slukkes
     apning-slutt.png  dagene etter – bare sporet etter kvelden står igjen
   Tekstene og kurven følger tidspunktene i reise.json og kassa.json. Høyst 8 ord synlig samtidig (sjekk-tekst teller
   denne scenen samtidig): fasene (5 ord) + én kort tekst (høyst 3). Sitatet fra gjesten telles ikke. */
const REISE = reise.varighet ? Math.min(reise.hendelser.slutt, reise.varighet) : 29.2
const KASSA = kassaMeta.varighet
const SLUTT_START = REISE + KASSA
const TOTAL = SLUTT_START + 5.5
const H = reise.hendelser
const FASER_REISE = [
  { navn: 'Før', fra: 0, til: 12 },
  { navn: 'Under', fra: 12, til: REISE },
  { navn: 'Etter', fra: REISE, til: SLUTT_START },
  { navn: 'Dagene etter', fra: SLUTT_START, til: TOTAL },
]
// Klokka øverst til venstre: bare klokkeslett og det nøytrale (stempler inn og ut). Det som løfter og tynger,
// står på lappene under (ARSAKER), så det ikke sies to ganger.
type Tekst = { fra: number; til: number; tekst: string; sitat?: boolean }
const TEKSTER: Tekst[] = [
  { fra: 3.0, til: 5.6, tekst: '16:00 Stempler inn' }, // etter at «Emma» har tont ut
  { fra: 12.3, til: H.takk - 0.3, tekst: '19:30' },
  { fra: REISE + 0.3, til: REISE + kassaMeta.krell - 0.2, tekst: '23:40' },
  { fra: REISE + kassaMeta.gar - 0.6, til: SLUTT_START - 0.2, tekst: '00:10 Stempler ut' },
]
// Snakkeboblene følger hodet til den som snakker i filmen (reise.json: bobler.*.spor = [tid, x, y] fra Blender).
// Det de sier, er replikker i en tenkt vakt (som sitatet fra gjesten i manuset) og telles ikke som ord på skjermen.
const BOBLER = [
  { id: 'leder', tekst: 'En kollega er syk. Kan du ta stasjonen hennes?', ...reise.bobler.leder },
  { id: 'gjest', tekst: '«Tusen takk for en fin kveld!»', ...reise.bobler.gjest },
]
function bobleSted(spor: number[][], t: number): [number, number] {
  if (t <= spor[0][0]) return [spor[0][1], spor[0][2]]
  for (let i = 1; i < spor.length; i++) {
    const [t0, x0, y0] = spor[i - 1]
    const [t1, x1, y1] = spor[i]
    if (t <= t1) {
      const u = (t - t0) / Math.max(0.001, t1 - t0)
      return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]
    }
  }
  const s = spor[spor.length - 1]
  return [s[1], s[2]]
}

// Følelseskurven: (tid, humør fra −1 til 1). Over linja er godt, under er tungt.
const KURVE: [number, number][] = [
  [0, 0.05], [5, 0.05], [H.syk, -0.2], [H.venter, -0.5], [15, -0.72], [H.takk - 0.4, -0.8], [H.takk + 0.6, 0.35], [H.servert, 0.62], [REISE, 0.5],
  [REISE + kassaMeta.sammenlign + 0.8, 0.55], [REISE + kassaMeta.krell, 0.25], [REISE + kassaMeta.kast + 0.4, -0.45], [SLUTT_START, -0.62], [TOTAL, -0.62],
]
// Lyspunkter (+) og smertepunkter (−) på kurven, med årsaken skrevet ut (11.11: det gikk for fort til at publikum
// fikk med seg hva som løftet og hva som tynget). Hver årsak kommer først stort øverst til venstre mens det skjer i
// filmen (fra «vis»), og flytter seg så ned til merket sitt på kurven (ved «t») og blir stående. Når filmen er
// ferdig, står hele reisen igjen med årsakene på. Ordene er de samme som i gruppens egne brukerreiser (dobbel
// stasjon, ingen pause, godt lag). «side» = hvilken vei lappen går ut fra merket, så naboer ikke dekker hverandre.
type Arsak = { t: number; vis: number; godt: boolean; tekst: string; side: 'midt' | 'hoyre' | 'venstre' }
const MERKER: Arsak[] = [
  { t: H.venter, vis: H.syk + 0.5, godt: false, tekst: 'Dobbel stasjon', side: 'midt' },
  { t: 15, vis: 12.6, godt: false, tekst: 'Ingen pause', side: 'hoyre' },
  { t: H.takk + 0.6, vis: H.takk, godt: true, tekst: 'Gjesten takker', side: 'venstre' },
  { t: H.servert, vis: H.hjelp + 0.3, godt: true, tekst: 'Godt team på jobb', side: 'hoyre' },
  { t: REISE + kassaMeta.sammenlign + 0.8, vis: REISE + kassaMeta.les, godt: true, tekst: 'Salg sammenlignes', side: 'hoyre' },
  { t: REISE + kassaMeta.kast + 0.4, vis: REISE + kassaMeta.krell, godt: false, tekst: 'Kassalappen kastes og prestasjonene havner i glemmeboken', side: 'venstre' },
  { t: SLUTT_START + 3.5, vis: SLUTT_START + 0.6, godt: false, tekst: 'Sliten etter kvelden før', side: 'venstre' },
]
/** Så lenge står årsaken stort øverst før den flytter seg ned til kurven (minst). */
const ARSAK_STOR = 2.4
const KX0 = 96
const KX1 = 1824
const KY0 = 836 // grunnlinja
const KH = 66
const kx = (t: number) => KX0 + ((KX1 - KX0) * t) / TOTAL
const ky = (v: number) => KY0 - v * KH
function humorVed(t: number) {
  for (let i = 1; i < KURVE.length; i++) {
    const [t0, v0] = KURVE[i - 1]
    const [t1, v1] = KURVE[i]
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / Math.max(0.001, t1 - t0)
  }
  return KURVE[KURVE.length - 1][1]
}
const KURVE_STI = (() => {
  const d: string[] = []
  for (let t = 0; t <= TOTAL; t += 0.25) d.push(`${d.length ? 'L' : 'M'}${kx(t).toFixed(1)} ${ky(humorVed(t)).toFixed(1)}`)
  return d.join(' ')
})()

/* Takt 0 (11.11): de to første brukerreisene gruppen laget – på gråpapir med lapper, og digitalt i arbeidskravet –
   vises som to ark før den animerte. De skal bare vises, ikke forklares. Ingen ord på skjermen. */
export function Reise({ takt }: SceneProps) {
  useLys(0)
  return (
    <div className="scene v2 re">
      <Studio vis={takt === 0} fase="mint" />
      <AnimatePresence>
        {takt === 0 && (
          <motion.div key="utkast" className="re-utkast" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.6, ease: MYK }}>
            <motion.div className="re-ark re-ark-1" initial={{ opacity: 0, y: 70, rotate: -7 }} animate={{ opacity: 1, y: 0, rotate: -2.5 }} transition={{ duration: 1.0, delay: 0.3, ease: MYK }}>
              <Foto id="reise-utkast-1" kamera="stille" />
            </motion.div>
            <motion.div className="re-ark re-ark-2" initial={{ opacity: 0, y: 70, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 2 }} transition={{ duration: 1.0, delay: 1.3, ease: MYK }}>
              <Foto id="reise-utkast-2" kamera="stille" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {takt >= 1 && <ReiseFilm />}
    </div>
  )
}

function ReiseFilm() {
  const r = useRef<HTMLVideoElement>(null)
  const k = useRef<HTMLVideoElement>(null)
  const [del, setDel] = useState<0 | 1 | 2>(0)
  const [t, setT] = useState(0)

  useEffect(() => {
    const v = r.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => setDel(1))
  }, [])
  useEffect(() => {
    if (del !== 1) return
    const v = k.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => setDel(2))
  }, [del])
  // Felles klokke: tiden i den filmen som går, pluss det som er spilt før
  useEffect(() => {
    let id = 0
    let slutt0 = 0
    const tikk = () => {
      if (del === 0 && r.current) setT(Math.min(REISE, r.current.currentTime))
      else if (del === 1 && k.current) setT(REISE + k.current.currentTime)
      else {
        if (!slutt0) slutt0 = performance.now()
        setT(Math.min(TOTAL, SLUTT_START + (performance.now() - slutt0) / 1000))
      }
      id = requestAnimationFrame(tikk)
    }
    id = requestAnimationFrame(tikk)
    return () => cancelAnimationFrame(id)
  }, [del])

  const fase = FASER_REISE.findIndex((f) => t >= f.fra && t < f.til)
  const tekst = TEKSTER.find((x) => t >= x.fra && t < x.til)
  const intro = t < 2.4
  const sporsmal = t >= SLUTT_START + 0.8
  // «Dagene etter»: de andre fasene toner ut før spørsmålet kommer (tom skjerm, bare sporet står igjen)
  const tom = t >= SLUTT_START
  return (
    <motion.div className="re-del" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <motion.video ref={r} className="re-film" src={filmUrl('reise')} muted playsInline preload="auto" onTimeUpdate={(e) => e.currentTarget.currentTime >= REISE - 0.05 && del === 0 && setDel(1)} onEnded={() => del === 0 && setDel(1)} onError={() => setDel(1)} initial={false} animate={{ opacity: del === 0 ? 1 : 0 }} transition={{ duration: 0.6 }} />
      <motion.video ref={k} className="re-film" src={filmUrl('kassa')} muted playsInline preload="auto" onEnded={() => setDel(2)} onError={() => setDel(2)} initial={false} animate={{ opacity: del === 1 ? 1 : 0 }} transition={{ duration: 0.6 }} />
      <motion.img className="re-film" src="film/apning2-slutt.png" alt="" initial={false} animate={{ opacity: del === 2 ? 1 : 0 }} transition={{ duration: 1.4 }} />
      <div className="re-skygge" />

      <AnimatePresence>
        {intro && (
          <motion.div key="intro" className="re-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <b>Emma</b>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!intro && tekst && (
          <motion.div key={tekst.tekst} className={`re-tekst ${tekst.sitat ? 'sitat' : ''} ${tekst.tekst.length === 5 ? 'bare-klokke' : ''}`} data-tekst={tekst.sitat ? 'sitat' : undefined} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.45, ease: MYK }}>
            {tekst.tekst.match(/^\d\d:\d\d/) ? (
              <>
                <b>{tekst.tekst.slice(0, 5)}</b> {tekst.tekst.slice(6)}
              </>
            ) : (
              tekst.tekst
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {BOBLER.filter((b) => del === 0 && t >= b.fra && t <= b.til).map((b) => {
          const [x, y] = bobleSted(b.spor, t)
          return (
            <motion.div key={b.id} className={`re-boble ${b.id}`} data-tekst="sitat" style={{ left: x * 1920, top: y * 1080 }} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, ease: MYK }}>
              {b.tekst}
            </motion.div>
          )
        })}
      </AnimatePresence>
      <AnimatePresence>
        {sporsmal && (
          <motion.p key="sp" className="re-sporsmal stor-serif" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, ease: MYK }}>
            Hva sitter Emma igjen med?
          </motion.p>
        )}
      </AnimatePresence>

      {/* Følelseskurven: tegnes etter hvert, grønn over linja (godt) og rød under (tungt) */}
      {!intro && (
        <svg className="re-kurve" viewBox="0 0 1920 1080" aria-hidden="true">
          <defs>
            <clipPath id="reTid">
              <rect x="0" y="0" width={kx(t)} height="1080" />
            </clipPath>
            <clipPath id="reOver">
              <rect x="0" y="0" width="1920" height={KY0} />
            </clipPath>
            <clipPath id="reUnder">
              <rect x="0" y={KY0} width="1920" height="1080" />
            </clipPath>
          </defs>
          <line x1={KX0} x2={KX1} y1={KY0} y2={KY0} className="re-grunn" />
          <g clipPath="url(#reTid)">
            <path d={`${KURVE_STI} L${KX1} ${KY0} L${KX0} ${KY0} Z`} className="re-flate-godt" clipPath="url(#reOver)" />
            <path d={`${KURVE_STI} L${KX1} ${KY0} L${KX0} ${KY0} Z`} className="re-flate-tungt" clipPath="url(#reUnder)" />
            <path d={KURVE_STI} className="re-linje-godt" clipPath="url(#reOver)" />
            <path d={KURVE_STI} className="re-linje-tungt" clipPath="url(#reUnder)" />
          </g>
          {MERKER.filter((m) => t >= m.t).map((m) => (
            <motion.g key={m.t} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.3, 1.6, 0.5, 1] }} style={{ transformOrigin: `${kx(m.t)}px ${ky(humorVed(m.t))}px` }}>
              <circle cx={kx(m.t)} cy={ky(humorVed(m.t))} r="15" className={m.godt ? 're-merke-godt' : 're-merke-tungt'} />
              <path d={m.godt ? `M${kx(m.t) - 7} ${ky(humorVed(m.t))}h14M${kx(m.t)} ${ky(humorVed(m.t)) - 7}v14` : `M${kx(m.t) - 7} ${ky(humorVed(m.t))}h14`} className="re-merke-tegn" />
            </motion.g>
          ))}
          <circle cx={kx(t)} cy={ky(humorVed(t))} r="7" className={humorVed(t) >= 0 ? 're-prikk-godt' : 're-prikk-tungt'} />
        </svg>
      )}

      {/* Årsakene: stort øverst til venstre mens det skjer, så ned til merket på kurven, der de blir stående */}
      {MERKER.filter((m) => t >= m.vis).map((m) => {
        const stor = t < Math.max(m.vis + ARSAK_STOR, m.t)
        const mx = kx(m.t)
        const my = ky(humorVed(m.t))
        const oppe = { left: 96, top: tekst ? 176 : 72, x: '0%', scale: 1.7 }
        const nede = {
          left: m.side === 'midt' ? mx : m.side === 'hoyre' ? mx - 24 : mx + 24,
          top: m.godt ? my - 72 : my + 28,
          x: m.side === 'midt' ? '-50%' : m.side === 'hoyre' ? '0%' : '-100%',
          scale: 1,
        }
        return (
          <motion.div key={m.tekst} className={`re-arsak ${m.godt ? 'godt' : 'tungt'} ${m.tekst.length > 30 ? 'lang' : ''}`} initial={{ opacity: 0, ...oppe, scale: 1.3 }} animate={{ opacity: 1, ...(stor ? oppe : nede) }} transition={{ duration: stor ? 0.45 : 0.9, ease: MYK }}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={m.godt ? 'M5 12h14M12 5v14' : 'M5 12h14'} />
            </svg>
            {m.tekst}
          </motion.div>
        )
      })}

      {/* Fasene står fast nederst; fasen hun er i, lyser. Til slutt står bare «Dagene etter» igjen. */}
      {!intro && (
        <div className="re-faser">
          {FASER_REISE.map((f, i) => (
            <div key={f.navn} className={`re-fase ${i === fase ? 'na' : ''}`} style={{ left: kx(f.fra), width: kx(f.til) - kx(f.fra) }}>
              <motion.span initial={false} animate={{ opacity: tom && i !== 3 ? 0 : 1 }} transition={{ duration: 0.6 }}>
                {f.navn}
              </motion.span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── 4. Ny problemstilling (B, Define) ──
   Den samme flipptavla som i del 1: SYKEFRAVÆR snur seg bokstav for bokstav og blir MOTIVASJON. Så skrives
   problemstillingen ut på en bong under tavla, som fra bongskriveren i resten av presentasjonen. */
export function Problemstilling({ takt }: SceneProps) {
  useLys(0)
  const snudd = takt >= 1
  const t = useSek(snudd)
  // Flippen tar ca. 3,1 s (siste bokstav lander sist) – så går skriveren
  const skriv = snudd && t > 3.3
  return (
    <div className="scene v2 ps">
      <Studio fase="mint" />
      <div className="ps-midt">
        <Inn d={0.5}>
          <Flipp fra="SYKEFRAVÆR" til="MOTIVASJON" start={snudd} />
        </Inn>
        <Inn d={0.7} className="ps-skriver">
          <span />
        </Inn>
        <div className="ps-utskrift">
          <motion.div
            className="bong ps-bong"
            initial={false}
            animate={{ y: skriv ? '0%' : '-102%' }}
            // Skriveren mater papiret i små rykk
            transition={{ duration: 2.2, ease: (x: number) => Math.floor(x * 9) / 9 + (x * 9 - Math.floor(x * 9)) ** 3 / 9 }}
          >
            <p>
              HVORDAN KAN VI
              <br />
              MOTIVERE SERVITØRER?
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ── Plassholder for scenene som bygges i steg 3 (bare på grenen manus-v2) ── */
export function Plassholder({ id }: { id: string }) {
  useLys(0)
  const s = manus.find((x) => x.id === id)
  return (
    <div className="scene v2 plassholder">
      <p>{s?.tittel}</p>
    </div>
  )
}

/* ── 6. Ideate (B): fra det vi så ved kassa til Vaktlogg ──
   0 Utgangspunktet: stillbildet fra kassascenen (de tre kassarapportene og skrittsporet på gulvet i samme bilde).
     Lappene ringes inn (salget), sporet ringes inn (skrittene), og streken mellom dem brytes: ingenting kobler dem.
   1 Kildene: Blender-filmen (kilder-* i pakket_ideer.py) – kassarapporten flyr inn i telefonen i stedet for i søpla,
     salg fra kassasystemet og skritt og puls fra klokka strømmer inn, og telefonen viser vakten. Etikettene følger
     objektene (kilder.json).
   2 Helsedataen er din: telefonen med Helse-skjermen (ekte skjermbilde), en lås, Emma ser – lederen ser ikke.
   Ord: Kassasystem, Klokke, Vaktlogg, «Helsedataen er din.» og Ideate = 7. */
const SAMMENLIGN = { lapper: { x: 948, y: 540, r: 236 }, spor: { x: 1316, y: 370, r: 112 } }
// Etikettene står over tingene sine (kilder.json gir toppen av hver ting i bildet). Klokka står så høyt at etiketten
// ville havnet under diamant-ikonet, så den står ved siden av urskiven i stedet (dx/dy fra toppen, side = til venstre).
const ETIKETTER: { id: 'kasse' | 'klokke' | 'telefon'; tekst: string; inn: number; dx?: number; dy?: number; side?: boolean }[] = [
  { id: 'kasse', tekst: 'Kassasystem', inn: 0.5 },
  { id: 'klokke', tekst: 'Klokke', inn: 0.8, dx: -118, dy: 340, side: true },
  { id: 'telefon', tekst: 'Vaktlogg', inn: kilder.skifter[2] },
]

function Tegnet({ vis, d, children }: { vis: boolean; d: number; children: ReactNode }) {
  return (
    <motion.g initial={false} animate={{ opacity: vis ? 1 : 0 }} transition={{ duration: 0.4, delay: vis ? d : 0 }}>
      {children}
    </motion.g>
  )
}

function RingMerke({ x, y, type, d }: { x: number; y: number; type: 'salg' | 'skritt'; d: number }) {
  return (
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45, delay: d, ease: [0.3, 1.5, 0.5, 1] }} style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y} r="36" className={`id-merke ${type}`} />
      <g transform={`translate(${x - 20.4} ${y - 20.4}) scale(1.7)`}>
        <MerkeTegn type={type} />
      </g>
    </motion.g>
  )
}

export function Ideate({ takt }: SceneProps) {
  useLys(0)
  const f = useFilm(takt === 1)
  const u = Math.min(1, f.t / kilder.varighet)
  const L = SAMMENLIGN.lapper
  const S = SAMMENLIGN.spor
  // Streken mellom sirklene, med et brudd på midten
  const dx = L.x - S.x
  const dy = L.y - S.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const a0 = { x: S.x + ux * S.r, y: S.y + uy * S.r }
  const b0 = { x: L.x - ux * L.r, y: L.y - uy * L.r }
  const mx = (a0.x + b0.x) / 2
  const my = (a0.y + b0.y) / 2
  return (
    <div className="scene v2 id">
      <motion.img className="id-bilde" src="film/kassa2-sammenlign.png" alt="" initial={false} animate={{ opacity: takt === 0 ? 1 : 0, scale: takt === 0 ? 1 : 1.04 }} transition={{ duration: 0.9 }} />
      {takt === 0 && (
        <svg className="id-tegning" viewBox="0 0 1920 1080" aria-hidden="true">
          <motion.circle cx={L.x} cy={L.y} r={L.r} className="id-ring salg" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.9, ease: MYK }} />
          <motion.circle cx={S.x} cy={S.y} r={S.r} className="id-ring skritt" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 2.1, ease: MYK }} />
          {/* Små merker på ringene (ingen ord): kassalapp = salget, fotspor = skrittene – samme tegn som i kildefilmen */}
          <RingMerke x={L.x - L.r * 0.707} y={L.y + L.r * 0.707} type="salg" d={1.9} />
          <RingMerke x={S.x + S.r * 0.707} y={S.y - S.r * 0.707} type="skritt" d={2.9} />
          <motion.line x1={a0.x} y1={a0.y} x2={mx - ux * 26} y2={my - uy * 26} className="id-strek" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 3.3 }} />
          <motion.line x1={b0.x} y1={b0.y} x2={mx + ux * 26} y2={my + uy * 26} className="id-strek" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 3.3 }} />
          <Tegnet vis d={4.0}>
            <circle cx={mx} cy={my} r="26" className="id-brudd" />
            <path d={`M${mx - 10} ${my - 10}L${mx + 10} ${my + 10}M${mx + 10} ${my - 10}L${mx - 10} ${my + 10}`} className="id-kryss" />
          </Tegnet>
        </svg>
      )}

      <motion.video ref={f.ref} className="id-film" src={filmUrl('kilder')} muted playsInline preload="auto" initial={false} animate={{ opacity: takt >= 1 ? 1 : 0 }} transition={{ duration: 0.9 }} />
      {takt === 1 &&
        ETIKETTER.map((e) => {
          const [x0, y0] = kilder.etiketterStart[e.id]
          const [x1, y1] = kilder.etiketter[e.id]
          const x = (x0 + (x1 - x0) * u) * 1920 + (e.dx ?? 0)
          const y = (y0 + (y1 - y0) * u) * 1080 + (e.dy ?? 0)
          // Plassen bærer sentreringen (CSS-transform); motion animerer bare etiketten inni, så de ikke overstyrer hverandre
          return (
            <div key={e.id} className={`id-etikett-plass ${e.side ? 'side' : ''}`} style={{ left: x, top: y }}>
              <motion.div className={`id-etikett ${e.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: f.t >= e.inn ? 1 : 0, y: f.t >= e.inn ? 0 : 8 }} transition={{ duration: 0.5, ease: MYK }}>
                {e.tekst}
              </motion.div>
            </div>
          )
        })}

      <Studio vis={takt === 2} fase="fersken" />
      {takt === 2 && (
        <div className="id-helse">
          <Inn d={0.2} className="id-helse-tekst">
            <p className="stor-serif">Helsedataen er din.</p>
            <div className="id-hvem" aria-hidden="true">
              <span className="ja">
                <svg viewBox="0 0 40 40">
                  <circle cx="20" cy="13" r="7" />
                  <path d="M7 35c2-8 8-12 13-12s11 4 13 12" />
                </svg>
                <svg viewBox="0 0 24 24" className="merke">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span className="nei">
                <svg viewBox="0 0 40 40">
                  <circle cx="20" cy="13" r="7" />
                  <path d="M7 35c2-8 8-12 13-12s11 4 13 12" />
                  <path d="M10 13h20" className="slips" />
                </svg>
                <svg viewBox="0 0 24 24" className="merke">
                  <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z M12 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5z M4 20L20 4" />
                </svg>
              </span>
            </div>
          </Inn>
          <motion.div className="id-telefon" initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 2 }} transition={{ duration: 1.0, ease: MYK }}>
            <img src="skjerm/helse.png" alt="" data-tekst="app" />
            <motion.span className="id-las" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1.0, ease: [0.3, 1.6, 0.5, 1] }}>
              <svg viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </motion.span>
          </motion.div>
        </div>
      )}
    </div>
  )
}

/* ── 7. Prototypen: papirskissen før telefonfilmen (Demo.tsx tar over etterpå) ──
   Bildet av den ekte papirskissen (plassen papirskisse i public/foto/foto.js, lagt inn 11.11) vises. Mangler
   bildet, tegnes en enkel strekskisse av startskjermen i stedet. Skissen glir over i det ekte skjermbildet av appen. */
export function Skisse() {
  const harFoto = hentFoto('papirskisse').status === 'ok'
  const t = useSek()
  const digital = t > 4.2
  return (
    <div className="scene v2 sk">
      <Studio fase="fersken" />
      <motion.div className={`sk-ark ${harFoto ? 'har-foto' : ''}`} initial={{ opacity: 0, y: 40, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: digital ? -6 : -3, x: digital ? -330 : 0, scale: digital ? 0.82 : 1 }} transition={{ duration: 1.1, ease: MYK }}>
        {harFoto ? (
          <Foto id="papirskisse" kamera="stille" />
        ) : (
          <svg viewBox="0 0 300 560" className="sk-strek" aria-hidden="true">
            {[
              'M30 40h120',
              'M30 78h190',
              'M30 100h150',
              'M30 140h240v90H30z',
              'M48 165h60M48 190h120',
              'M30 260h110v110H30z M160 260h110v110H160z',
              'M56 300a20 20 0 1 0 40 0a20 20 0 1 0-40 0',
              'M190 315l20-25 20 25',
              'M30 400h240',
              'M30 420h80M150 420h120',
              'M40 470h220a22 22 0 0 1 0 44H40a22 22 0 0 1 0-44z',
              'M120 492h60',
            ].map((d, i) => (
              <motion.path key={i} d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.22, ease: 'easeInOut' }} />
            ))}
          </svg>
        )}
      </motion.div>
      <motion.svg className="sk-pil" viewBox="0 0 220 60" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: digital ? 1 : 0 }} transition={{ duration: 0.6, delay: digital ? 0.6 : 0 }}>
        <path d="M10 30 C 70 6, 140 6, 196 28" />
        <path d="M184 16l14 12-17 7" />
      </motion.svg>
      <motion.div className="sk-telefon" initial={{ opacity: 0, x: 120 }} animate={{ opacity: digital ? 1 : 0, x: digital ? 0 : 120 }} transition={{ duration: 1.0, delay: digital ? 0.4 : 0, ease: MYK }}>
        <img src="skjerm/start.png" alt="" data-tekst="app" />
      </motion.div>
    </div>
  )
}

/* ── 8. Test og iterasjon (C) ──
   0 Lenken: prototypen ligger på nett – lenken sendes ut, og telefon etter telefon lyser opp med appen.
   1 Tilbakemeldingene: testerne skriver i appen, det kommer som e-post. Det ekte skjemaet «Gi tilbakemelding» står
     til høyre, og seks ekte tilbakemeldinger (Formspree) kommer inn fra det én etter én, ordrett og uten navn.
   2 Forslaget om en månedlig rapport ble månedsoppsummeringen: kortet glir til venstre, og en Blender-loop
     (maned_loop.py, anim-*) spiller den animerte månedsoppsummeringen fra prototypen, merket «Simulert».
   3 Én runde om gangen: hoppefilmen (kula mellom innsikt og prototype, med datoene fra prosjektet) og ringen
     tilbakemelding → endring → ny test.
   Ord: lenken, «tilbakemelding», «endring», «ny test», «Test», «Månedsoppsummering» og «Simulert» = 8
   (sitatene og skjermbildene telles ikke). */
const TELEFONER = Array.from({ length: 9 }, (_, i) => {
  const a = Math.PI * (0.16 + (0.68 * i) / 8)
  return { x: 960 - Math.cos(a) * 700, y: 860 - Math.sin(a) * 430, d: 1.3 + Math.abs(i - 4) * 0.18 }
})
// Ekte tilbakemeldinger fra skjemaet i prototypen (Formspree), ordrett og uten navn.
// x/y = plassen i innboksen (takt 1), r = liten skjevhet. Forslaget om en månedlig rapport (2) ble
// månedsoppsummeringen (takt 2): da glir det kortet til venstre og de andre tones bort.
const TILBAKEMELDINGER = [
  { tekst: 'Hadde det vært mulig med en slags guide når man åpner appen for å få en forklaring på de ulike funksjonene?', x: 40, y: 290, r: -1.2 },
  { tekst: 'Det hadde vært kult om skrittene ble sammenlignet med avstander vi kjenner til. For eksempel at at man har gått fra oslo s til Holmenkollen eller at på et år har man gått fra norge til Hellas', x: 480, y: 268, r: 0.9 },
  { tekst: 'It should be a monthly report that presents stats on the end of a month. This could include achievements like how many steps in total or how many steps per nok and so on.', x: 920, y: 296, r: -0.7 },
  { tekst: 'Jeg skulle ønske at fargekombinasjonen var litt finere, for eksempel med pastel farger.', x: 56, y: 650, r: 0.8 },
  { tekst: 'Det hadde vært kult om det var mulig å koble til Garmin klokken min slik at jeg kan få opp kudos på armen under vakten', x: 492, y: 636, r: -0.9 },
  { tekst: "I would like this app at my restaurant. I don't think I am interested in all the futures, but tracking my sales is fun especially if I can access my sales data easy and together with steps and heart rate that makes it more fun to see!", x: 912, y: 660, r: 1.1 },
]
const MANED = 2

export function Test({ takt }: SceneProps) {
  useLys(0)
  const h = useFilm(takt === 3)
  // Lenken på skjermen er forkortet (11.11): den ekte adressen har brukernavnet i seg og var for stor. QR-koden på
  // sluttkortet og oppsett.prototypeUrl peker fortsatt til den ekte adressen.
  const lenke = 'github.io/vaktlogg'
  const t = useSek()
  const fokus = takt === 2 ? MANED : -1
  // Loopen starter fra første side (gjestene) når kortet med forslaget kommer
  const maned = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = maned.current
    if (!v || takt !== 2) return
    v.currentTime = 0
    v.play().catch(() => {})
  }, [takt])
  return (
    <div className="scene v2 te">
      <Studio vis={takt < 3} fase="rosa" />
      {takt === 0 && (
        <>
          <svg className="te-linjer" viewBox="0 0 1920 1080" aria-hidden="true">
            {TELEFONER.map((p, i) => (
              <motion.line key={i} x1={960} y1={292} x2={p.x} y2={p.y - 80} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.6, delay: p.d - 0.5 }} />
            ))}
          </svg>
          <motion.div className="te-lenke" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: MYK }}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
            </svg>
            {lenke}
          </motion.div>
          {TELEFONER.map((p, i) => (
            <motion.div key={i} className="te-telefon" style={{ left: p.x - 58, top: p.y - 120 }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: t > p.d ? 1 : 0.18, scale: t > p.d ? 1 : 0.92 }} transition={{ duration: 0.45, ease: MYK }}>
              <img src="skjerm/start.png" alt="" data-tekst="app" />
            </motion.div>
          ))}
        </>
      )}

      {(takt === 1 || takt === 2) && (
        <div className={`te-epost takt-${takt}`}>
          {TILBAKEMELDINGER.map((m, i) => {
            const valgt = i === fokus
            const borte = fokus >= 0 && !valgt
            return (
              <motion.div
                key={i}
                className={`te-brev ${valgt ? 'valgt' : ''}`}
                initial={{ opacity: 0, y: m.y, x: m.x + 120, rotate: m.r, width: 420, fontSize: 22, scale: 0.9 }}
                animate={{
                  opacity: borte ? 0 : 1,
                  x: valgt ? 110 : m.x,
                  y: valgt ? 330 : borte ? m.y + 30 : m.y,
                  rotate: valgt ? 0 : m.r,
                  scale: borte ? 0.94 : 1,
                  width: valgt ? 790 : 420,
                  fontSize: valgt ? 33 : 22,
                }}
                transition={{ duration: 0.8, delay: takt === 1 ? 1.1 + i * 0.45 : valgt ? 0.15 : 0, ease: MYK }}
              >
                <div className="te-brev-topp" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  <i />
                  <i className="kort" />
                </div>
                <p data-tekst="sitat">«{m.tekst}»</p>
              </motion.div>
            )
          })}
          {/* Takt 1: det ekte skjemaet i prototypen – tilbakemeldingene kommer derfra */}
          <motion.svg className="te-pil te-pil-skjema" viewBox="0 0 160 60" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: takt === 1 ? 1 : 0 }} transition={{ duration: 0.5, delay: takt === 1 ? 0.8 : 0 }}>
            <path d="M152 30H22M34 18L20 30l14 12" />
          </motion.svg>
          <motion.div className="te-domeo te-skjema" initial={{ opacity: 0, y: 30 }} animate={{ opacity: takt === 1 ? 1 : 0, y: takt === 1 ? 0 : 30 }} transition={{ duration: 0.9, delay: takt === 1 ? 0.2 : 0, ease: MYK }}>
            <img src="skjerm/tilbakemelding-skjema.png" alt="" data-tekst="app" />
          </motion.div>
          {/* Takt 2: forslaget → månedsoppsummeringen (Blender-loop, maned_loop.py anim-*, opptak av den ekte animasjonen) */}
          <motion.svg className="te-pil" viewBox="0 0 160 60" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: takt === 2 ? 1 : 0 }} transition={{ duration: 0.5, delay: takt === 2 ? 0.6 : 0 }}>
            <path d="M8 30h130M126 18l14 12-14 12" />
          </motion.svg>
          <motion.div className="te-maned" initial={{ opacity: 0, y: 40 }} animate={{ opacity: takt === 2 ? 1 : 0, y: takt === 2 ? 0 : 40 }} transition={{ duration: 1.0, delay: takt === 2 ? 0.7 : 0, ease: MYK }}>
            <video ref={maned} src="film/maned-anim.webm" muted loop playsInline preload="auto" />
            <div className="te-maned-navn">
              <b>Månedsoppsummering</b>
            </div>
          </motion.div>
        </div>
      )}

      <motion.video ref={h.ref} className="te-film" src={filmUrl('hopping')} muted playsInline preload="auto" initial={false} animate={{ opacity: takt === 3 ? 1 : 0 }} transition={{ duration: 0.9 }} />
      {takt === 3 && (
        <motion.div className="te-ring" initial={{ opacity: 0, y: 14 }} animate={{ opacity: h.t > 9.6 ? 1 : 0, y: h.t > 9.6 ? 0 : 14 }} transition={{ duration: 0.8, ease: MYK }}>
          <span>Tilbakemelding</span>
          <i aria-hidden="true">→</i>
          <span>endring</span>
          <i aria-hidden="true">→</i>
          <span>ny test</span>
          <svg viewBox="0 0 60 40" aria-hidden="true">
            <path d="M6 22a18 14 0 1 0 12-14" />
            <path d="M12 3l7 5-7 5" />
          </svg>
        </motion.div>
      )}
    </div>
  )
}

/* ── 9. Veien videre og avslutning (C, A, B) ──
   0 Piloten: siste bilde fra kildefilmen (kassa, klokke og telefon) og én restaurant – koblet sammen – og bongen
     «Pilot med ekte data».
   1 Svart. Flipptavla med SYKEFRAVÆR kommer tilbake (A).  2 Den snur til MOTIVASJON (B).
   3–4 Sluttbongen skrives ut med QR-kode til prototypen (C), og blir stående mens dere tar spørsmål.
   Ord: «Pilot med ekte data», SYKEFRAVÆR, MOTIVASJON og VAKTLOGG = 7. */
export function Videre({ takt }: SceneProps) {
  useLys(0)
  const t = useSek(takt >= 3)
  const skriv = takt >= 3 && t > 0.6
  return (
    <div className="scene v2 vi">
      <motion.div className="vi-pilot" initial={false} animate={{ opacity: takt === 0 ? 1 : 0 }} transition={{ duration: 0.9 }}>
        <img className="vi-kilder" src="film/kilder2-slutt.png" alt="" />
        <motion.div className="vi-restaurant" initial={{ opacity: 0, y: -30, rotate: -3 }} animate={{ opacity: takt === 0 ? 1 : 0, y: 0, rotate: -3 }} transition={{ duration: 0.9, delay: 0.5, ease: MYK }}>
          <img src="film/apning2-frys.png" alt="" />
        </motion.div>
        {/* «Én restaurant, én kasse og én klokke koblet til telefonen»: tre stiplede linjer inn til telefonen i midten
            (sluttbildet fra kildefilmen: kassa til venstre, telefonen i midten, klokka til høyre) */}
        <svg className="vi-kobling" viewBox="0 0 1920 1080" aria-hidden="true">
          {['M452 150 C 640 150, 790 190, 858 282', 'M418 446 C 560 446, 700 480, 826 480', 'M1596 505 C 1430 505, 1250 480, 1096 480'].map((d, i) => (
            <motion.path key={d} d={d} initial={{ pathLength: 0 }} animate={{ pathLength: takt === 0 ? 1 : 0 }} transition={{ duration: 0.8, delay: 1.2 + i * 0.3 }} />
          ))}
        </svg>
        <div className="vi-bongrad">
          <motion.div className="bong vi-bong" initial={{ y: '-105%' }} animate={{ y: takt === 0 ? '0%' : '-105%' }} transition={{ duration: 1.6, delay: 2.0, ease: (x: number) => Math.floor(x * 7) / 7 + (x * 7 - Math.floor(x * 7)) ** 3 / 7 }}>
            <p>PILOT MED EKTE DATA</p>
          </motion.div>
        </div>
      </motion.div>

      <Studio vis={takt >= 1} fase="rosa" />
      {takt >= 1 && (
        <div className="ps-midt vi-slutt">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: takt >= 3 ? -60 : 0, scale: takt >= 3 ? 0.8 : 1 }} transition={{ duration: 0.9, ease: MYK }}>
            <Flipp fra="SYKEFRAVÆR" til="MOTIVASJON" start={takt >= 2} />
          </motion.div>
          <div className="vi-utskrift">
            <motion.div className="bong vi-sluttbong" initial={false} animate={{ y: skriv ? '0%' : '-102%' }} transition={{ duration: 2.4, ease: (x: number) => Math.floor(x * 9) / 9 + (x * 9 - Math.floor(x * 9)) ** 3 / 9 }}>
              <b>VAKTLOGG</b>
              <img src="qr-prototype.svg" alt="QR-kode til prototypen" />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
