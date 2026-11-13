import { useEffect, useRef, useState } from 'react'
import { spillLyd } from '../lib/lyd.ts'
import { motion } from 'motion/react'
import meta from '../lib/telefon.json'
import { filmUrl } from '../lib/film.ts'
import { manus } from '../content/manus.ts'
import { romkode, speilmodus } from '../lib/mobil.ts'
import { forrige, hent, neste, sendStatus } from '../lib/sync.ts'
import { MYK, useLys, type SceneProps } from './felles.tsx'
import { Skisse } from './V2.tsx'

/** Takten med telefonfilmen i demoscenen (manus v2: papirskissen kommer først). Takter før den er negative i Demo. */
export const DEMO_FILM = Math.max(0, manus.find((s) => s.id === 'demo')?.takter.findIndex((t) => t.hvem === 'stille') ?? 0)

/* ══ 10. Prøv selv: prototype reveal + sensors omvisning ═════════════════════════
   Blender-filmen (public/film/telefon3.mp4) ender med skjermen midt i bildet, SKJERM_ANDEL
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

// Prototypen her viser alltid det som skjer på sensors mobil (?speil=vis): via eksamenstjeneren (npm run eksamen)
// eller via reléet over internett med romkoden (GitHub Pages, fil). Er ingen mobil koblet til, virker prototypen
// som vanlig, og sensor eller C trykker på storskjermen.

/** Telefonen med den ekte prototypen. Lastes rett før demoen (last) og tegnes ikke mens den er skjult –
 *  Sir Domeo i 3D koster mye, og skal ikke stjele tid fra filmen og animasjonene ellers.
 *  sensor: sensor har mobilen nå – da snakker Sir Domeo (stemmen spilles her, ikke på mobilen).
 *  overlevering: C gir mobilen til sensor. Glemmer C å klikke videre, går presentasjonen videre av seg selv
 *  idet sensor trykker «Start vakt» (Sir Domeo går til neste replikk) – da blir han aldri stum. */
export function DemoTelefon({ visning, demoNr, last, sensor, overlevering }: { visning: Visning; demoNr: number; last: boolean; sensor: boolean; overlevering: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [forklaring, setForklaring] = useState<Forklaring>(FORKLARINGER.start)
  const forrigeNr = useRef<number | null>(null)

  // Ny demo: rene data og last på nytt. Utenfor demoen er prototypen ikke lastet i det hele tatt.
  // Sensors mobil nullstilles én gang per demoNr: første gang prototypen lastes i en fremføring (start() øker
  // demoNr), og hver gang presentatøren trykker R. Prototypen husker hvilket nummer den har nullstilt for, så en
  // omlasting midt i demoen ikke starter sensors omvisning på nytt.
  useEffect(() => {
    const f = ref.current
    if (!f) return
    if (!last) {
      f.src = 'about:blank'
      forrigeNr.current = null
      return
    }
    const nullstill = true
    forrigeNr.current = demoNr
    klargjorPrototype()
    let aktiv = true
    speilmodus().then((m) => {
      if (!aktiv) return
      f.src = `demo/vaktlogg.html?sensor&speil=vis${m === 'rele' ? `&rom=${romkode()}` : ''}${nullstill ? `&nullstill=${demoNr}` : ''}&n=${demoNr}`
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
    sendStatus({ demo: forklaring.tittel })
  }, [forklaring])

  // ── Sir Domeos stemme: prototypen sier fra (postMessage) hver gang han begynner på en replikk ──
  const lyd = useRef<HTMLAudioElement | null>(null)
  const sisteReplikk = useRef<string | null>(null)
  const sensorNa = useRef(sensor)
  const overleveringNa = useRef(overlevering)
  overleveringNa.current = overlevering
  const si = (id: string | null) => {
    lyd.current?.pause()
    lyd.current = null
    if (!id) return
    // Felles lydspiller (lib/lyd.ts): på iPad/iPhone spiller den også når prototypen sier fra uten et trykk
    const a = spillLyd(`demo/domeo/${id}.mp3`)
    lyd.current = a
  }
  useEffect(() => {
    const ta = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || !e.data || typeof e.data !== 'object' || !('vaktloggDomeo' in e.data)) return
      const id = e.data.vaktloggDomeo as string | null
      const forrige = sisteReplikk.current
      sisteReplikk.current = id
      if (sensorNa.current) si(id)
      // Sensor har trykket «Åpne Vaktlogg» (eller seg videre) mens C fortsatt står på overleveringen: gå videre til
      // sensors takt, så Sir Domeo begynner å snakke med en gang. (Fra 12.11 starter første replikk først når sensor
      // trykker på forsiden, ikke når prototypen lastes.)
      else if (overleveringNa.current && id && id !== forrige) {
        const t = hent()
        if (manus[t.scene]?.id === 'demo' && t.takt === DEMO_FILM + 1) neste()
      }
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

  // Klikkeren virker også mens fokus er inne i prototypen (PageDown/PageUp, og piltastene hvis klikkeren sender dem)
  const kobleTaster = () => {
    try {
      const w = ref.current?.contentWindow
      if (!w) return
      w.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'PageDown' || e.key === 'ArrowRight') {
            e.preventDefault()
            neste()
          } else if (e.key === 'PageUp' || e.key === 'ArrowLeft') {
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
    if (takt < 0) {
      // Papirskissen: telefonen og filmen venter
      setFerdig(false)
      onVisning('skjult')
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
          if (manus[t.scene]?.id === 'demo' && t.takt === DEMO_FILM) neste()
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

  // Vakt: står filmen stille i 3 s mens den skal gå (vinduet skjult, dekoderen hang), går demoen videre likevel
  useEffect(() => {
    const v = video.current
    if (!v || takt !== 0) return
    let sist = -1
    let stille = 0
    const id = window.setInterval(() => {
      if (v.currentTime === sist && !v.ended) stille += 1
      else stille = 0
      sist = v.currentTime
      if (stille >= 6) setFilmFeil(true)
    }, 500)
    return () => clearInterval(id)
  }, [takt])

  if (takt < 0) return <Skisse />
  return (
    <div className="scene demo">
      <img className="demo-film" src="film/telefon3-slutt.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
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
