import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import meta from '../lib/telefon.json'
import { filmTilstand, filmUrl } from '../lib/film.ts'
import { manus } from '../content/manus.ts'
import { forrige, hent, neste, sendStatus } from '../lib/sync.ts'
import { MYK, useLys, type SceneProps } from './felles.tsx'

/* ══ 10. Prøv selv: prototype reveal + sensors omvisning ═════════════════════════
   Blender-filmen (public/film/telefon.mp4) ender med skjermen midt i bildet, SKJERM_ANDEL
   av bildehøyden. Den ekte prototypen ligger klar i en iframe nøyaktig der og tones inn
   over siste bilde – og blir stående midt på skjermen. Ingen tekst ved siden av: sensor
   trykker selv (på en mobil vi gir sensor, speilet hit), og Sir Domeo forklarer med stemmen. */

const VW = 390 // prototypens bredde (CSS-px)
const VH = 844
const SKJERM_H = meta.skjermAndel * 1080 // px på lerretet
const SKALA = SKJERM_H / VH
const KANT = 18 // telefonrammen rundt skjermen (prototype-px)
const PROTO_KEY = 'vaktlogg:v4'

/** Hva demoen viser akkurat nå – avledet fra prototypens adresse og fase (vises i presentatørvinduet). */
type Forklaring = { id: string; over: string; tittel: string; innsikt: string; farge: string }
const FORKLARINGER: Record<string, Forklaring> = {
  start: { id: 'start', over: 'Før vakten', tittel: 'Kveldens spill – frivillig', innsikt: 'Ikke alle vil konkurrere: velg duell, makker, laget – eller rolig.', farge: 'var(--papir)' },
  live: { id: 'live', over: 'Under vakten', tittel: 'Kvelden spilles av på to minutter', innsikt: 'Simulerte data. Fire bokser: helse, salg, konkurranse og gjester.', farge: 'var(--papir)' },
  salg: { id: 'salg', over: 'Innsikt · salg (observert)', tittel: 'Kassarapporten – nå hennes', innsikt: 'Ansatte sjekket rapporten etter vakten. Her er den underveis og etterpå.', farge: 'var(--salg)' },
  konkurranse: { id: 'konkurranse', over: 'Prinsipp · rettferdighet', tittel: 'Duell mot egen vanlige kveld', innsikt: 'Ulike stasjoner og gjester – så fremgangen teller, ikke stasjonen. Rolig modus skrur spillene av.', farge: 'var(--fersken)' },
  helse: { id: 'helse', over: 'Innsikt · skritt · prinsipp · fysisk belastning', tittel: 'Bare til personlig innsikt', innsikt: 'Interessen for skritt var tydelig. Ingen premie for flest skritt eller høyest puls.', farge: 'var(--aktivitet)' },
  gjester: { id: 'gjester', over: 'Fra testingen', tittel: 'Gjesteoversikt', innsikt: 'Servitører ønsket oversikt over egne gjester og bord – utforsket, men utenfor kjernen.', farge: 'var(--papir)' },
  sjef: { id: 'sjef', over: 'Prinsipp · personvern og usynlig innsats', tittel: 'Lederen ser laget – ikke tall per person', innsikt: 'Lagmål og takkekort for noe konkret.', farge: 'var(--rosa)' },
  slutt: { id: 'slutt', over: 'Brukerreisen · etter vakten', tittel: 'Sluttrapporten', innsikt: 'Mulighetsrommet: egne resultater, rekorder, kudos og takkekort samlet.', farge: 'var(--rosa)' },
  mal: { id: 'mal', over: 'Prinsipp · ansvarlig salg', tittel: 'Mål over tid', innsikt: 'Premier for mål over en periode fremfor kortvarige konkurranser.', farge: 'var(--fersken)' },
  meg: { id: 'meg', over: 'Belønninger', tittel: 'Poletter for det du selv styrer', innsikt: 'Personalmenyen: belønninger for handlinger ansatte selv kan påvirke.', farge: 'var(--fersken)' },
  historikk: { id: 'historikk', over: 'Brukerreisen · dagene etter', tittel: 'Historikk og månedsoppsummering', innsikt: 'Egen utvikling over tid.', farge: 'var(--rosa)' },
}

function lesForklaring(w: Window | null): Forklaring {
  try {
    const hash = (w?.location.hash || '#/vakt').replace(/^#\/?/, '')
    const [forste, andre] = hash.split('/')
    const fase = JSON.parse(w?.localStorage.getItem(PROTO_KEY) || '{}')?.demo?.phase as string | undefined
    if (forste === 'sjef') return FORKLARINGER.sjef
    if (forste === 'mal') return FORKLARINGER.mal
    if (forste === 'meg') return FORKLARINGER.meg
    if (forste === 'historikk' || forste === 'maned') return FORKLARINGER.historikk
    if (andre && FORKLARINGER[andre]) return FORKLARINGER[andre]
    if (fase === 'done') return FORKLARINGER.slutt
    if (fase === 'live') return FORKLARINGER.live
  } catch {
    /* prototypen er fra et annet opphav (åpnet fra fil) – vis startteksten */
  }
  return FORKLARINGER.start
}

/** Gjør prototypen klar til en ren demo: Sir Domeo spør ikke om omvisning, vakten står klar. */
export function klargjorPrototype() {
  try {
    localStorage.setItem(PROTO_KEY, JSON.stringify({ settings: { guide: 'self', guideSeen: true, introDismissed: true }, demo: {} }))
  } catch {
    /* ingen lagring – Sir Domeo spør, trykk «utforsk selv» */
  }
}

type Visning = 'skjult' | 'film' | 'demo'

// Eksamenstjeneren (npm run eksamen) videresender sensors mobil. Finnes den, viser prototypen her det som skjer
// på mobilen (?speil=vis). Ellers (GitHub Pages, fil) går omvisningen her, og sensor eller C trykker på storskjermen.
let speil: Promise<boolean> | null = null
function harSpeil() {
  speil ??= window.location.protocol.startsWith('http')
    ? fetch('speil-status', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => j?.speil === true)
        .catch(() => false)
    : Promise.resolve(false)
  return speil
}

/** Telefonen med den ekte prototypen. Lastes rett før demoen (last) og tegnes ikke mens den er skjult –
 *  Sir Domeo i 3D koster mye, og skal ikke stjele tid fra filmen og animasjonene ellers.
 *  sensor: sensor har mobilen nå – da snakker Sir Domeo (stemmen spilles her, ikke på mobilen). */
export function DemoTelefon({ visning, demoNr, last, sensor }: { visning: Visning; demoNr: number; last: boolean; sensor: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [forklaring, setForklaring] = useState<Forklaring>(FORKLARINGER.start)
  const [speiles, setSpeiles] = useState(false)
  const forrigeNr = useRef<number | null>(null)

  // Ny demo: rene data og last på nytt. Utenfor demoen er prototypen ikke lastet i det hele tatt.
  // Trykker presentatøren R (ny demo) mens den er lastet, starter også sensors mobil omvisningen på nytt.
  useEffect(() => {
    const f = ref.current
    if (!f) return
    if (!last) {
      f.src = 'about:blank'
      forrigeNr.current = null
      return
    }
    const nullstill = forrigeNr.current !== null && forrigeNr.current !== demoNr
    forrigeNr.current = demoNr
    klargjorPrototype()
    let aktiv = true
    harSpeil().then((s) => {
      if (!aktiv) return
      setSpeiles(s)
      f.src = `demo/vaktlogg.html?sensor${s ? '&speil=vis' : ''}${s && nullstill ? `&nullstill=${demoNr}` : ''}&n=${demoNr}`
    })
    return () => {
      aktiv = false
    }
  }, [demoNr, last])

  // Følg med på hvor sensor er i prototypen, og send det til presentatørvinduet
  useEffect(() => {
    if (visning === 'skjult') return
    const id = window.setInterval(() => {
      const fk = lesForklaring(ref.current?.contentWindow ?? null)
      setForklaring((g) => (g.id === fk.id ? g : fk))
    }, 400)
    return () => clearInterval(id)
  }, [visning])

  useEffect(() => {
    sendStatus({ film: filmTilstand(), demo: forklaring.tittel })
  }, [forklaring])

  // ── Sir Domeos stemme: prototypen sier fra (postMessage) hver gang han begynner på en replikk ──
  const lyd = useRef<HTMLAudioElement | null>(null)
  const sisteReplikk = useRef<string | null>(null)
  const sensorNa = useRef(sensor)
  const si = (id: string | null) => {
    lyd.current?.pause()
    lyd.current = null
    if (!id) return
    const a = new Audio(`demo/domeo/${id}.mp3`)
    lyd.current = a
    a.play().catch(() => {
      /* uten lyd står replikken i boblen */
    })
  }
  useEffect(() => {
    const ta = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || !e.data || typeof e.data !== 'object' || !('vaktloggDomeo' in e.data)) return
      sisteReplikk.current = e.data.vaktloggDomeo as string | null
      if (sensorNa.current) si(sisteReplikk.current)
    }
    window.addEventListener('message', ta)
    return () => window.removeEventListener('message', ta)
  }, [])
  // Når sensor får mobilen, sier Sir Domeo replikken han står på. Går vi videre, får han snakke ferdig.
  useEffect(() => {
    sensorNa.current = sensor
    if (sensor) si(sisteReplikk.current)
  }, [sensor])
  useEffect(() => {
    if (visning !== 'skjult') return
    lyd.current?.pause()
    lyd.current = null
  }, [visning])

  // Klikkeren virker også mens fokus er inne i prototypen (PageDown/PageUp)
  const kobleTaster = () => {
    try {
      const w = ref.current?.contentWindow
      if (!w) return
      w.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'PageDown') {
            e.preventDefault()
            neste()
          } else if (e.key === 'PageUp') {
            e.preventDefault()
            forrige()
          }
        },
        true,
      )
    } catch {
      /* annet opphav */
    }
  }

  return (
    <>
      <motion.div
        className="demo-telefon"
        style={{ width: VW + KANT * 2, height: VH + KANT * 2, left: 960 - (VW + KANT * 2) / 2, top: 540 - (VH + KANT * 2) / 2, scale: SKALA }}
        initial={false}
        animate={visning === 'skjult' ? { opacity: 0, transitionEnd: { display: 'none' } } : { opacity: 1, display: 'block' }}
        transition={{ opacity: { duration: visning === 'film' ? 0.5 : 0.4 } }}
        aria-hidden={visning === 'skjult'}
      >
        <iframe ref={ref} title="Vaktlogg – prototypen" className="demo-ramme" style={{ width: VW, height: VH, borderRadius: meta.skjermHjorne * VH }} onLoad={kobleTaster} allow="autoplay" tabIndex={visning === 'skjult' ? -1 : 0} />
      </motion.div>

      <motion.div className="demo-hjorne" initial={false} animate={{ opacity: visning === 'demo' ? 1 : 0 }} transition={{ duration: 1, delay: visning === 'demo' ? 1.2 : 0 }}>
        <span className={`demo-styrer ${sensor ? 'na' : ''}`}>{speiles ? 'Sensor trykker på mobilen' : 'Trykk på skjermen'}</span>
        <span className="demo-merk">Konseptprototype · fiktiv restaurant · simulerte data</span>
      </motion.div>
    </>
  )
}

/** Selve scenen: filmen i første takt. Telefonen (DemoTelefon) styres fra salen ut fra takten. */
export function Demo({ takt, onVisning }: SceneProps & { onVisning: (v: Visning) => void }) {
  useLys(0)
  const video = useRef<HTMLVideoElement>(null)
  const [ferdig, setFerdig] = useState(takt > 0)
  const [filmFeil, setFilmFeil] = useState(false)

  useEffect(() => {
    if (takt > 0) {
      setFerdig(true)
      onVisning('demo')
      return
    }
    setFerdig(false)
    onVisning('skjult')
    const v = video.current
    if (!v) return
    const tidtakere: number[] = []
    // Når filmen står stille på siste bilde, legges den ekte prototypen oppå – og så glir demoen i gang.
    // Styres av filmen selv, ikke av klokka, så en treg start aldri kutter filmen.
    const overta = () => {
      onVisning('film')
      tidtakere.push(
        window.setTimeout(() => {
          const t = hent()
          if (manus[t.scene]?.id === 'demo' && t.takt === 0) neste()
        }, 900),
      )
    }
    if (filmFeil) {
      setFerdig(true)
      overta()
      return () => tidtakere.forEach(clearTimeout)
    }
    v.currentTime = 0
    v.play().catch(() => setFilmFeil(true))
    const id = window.setInterval(() => {
      if (v.currentTime >= meta.stilleFra + 0.15 || v.ended) {
        clearInterval(id)
        overta()
      }
    }, 50)
    return () => {
      clearInterval(id)
      tidtakere.forEach(clearTimeout)
    }
  }, [takt, onVisning, filmFeil])

  useEffect(() => () => onVisning('skjult'), [onVisning])

  return (
    <div className="scene demo">
      <motion.video
        ref={video}
        className="demo-film"
        src={filmUrl()}
        muted
        playsInline
        preload="auto"
        onError={() => setFilmFeil(true)}
        animate={{ opacity: takt > 0 ? 0 : 1 }}
        transition={{ duration: 1.2, ease: MYK }}
      />
      {/* Reserve hvis filmen mangler: telefonen tones rett inn */}
      {ferdig && takt === 0 && <div className="demo-reserve" />}
      <motion.div className="demo-glod" initial={{ opacity: 0 }} animate={{ opacity: takt > 0 ? 1 : 0 }} transition={{ duration: 2 }} />
    </div>
  )
}
