import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import meta from '../lib/telefon.json'
import { filmUrl } from '../lib/film.ts'
import { forrige, neste, sendStatus } from '../lib/sync.ts'
import { FILM, MYK, useLys, type SceneProps } from './felles.tsx'

/* ══ 12. Prototype reveal + live demo ════════════════════════════════════════════
   Blender-filmen (public/film/telefon.mp4) ender med skjermen midt i bildet, SKJERM_ANDEL
   av bildehøyden. Den ekte prototypen ligger klar i en iframe nøyaktig der og tones inn
   over siste bilde – så glir telefonen til side, og forklaringen kommer frem ved siden av. */

const VW = 390 // prototypens bredde (CSS-px)
const VH = 844
const SKJERM_H = meta.skjermAndel * 1080 // px på lerretet
const SKALA = SKJERM_H / VH
const KANT = 18 // telefonrammen rundt skjermen (prototype-px)
const DEMO_X = 640 // senter for telefonen under demoen
const PROTO_KEY = 'vaktlogg:v4'

/** Hva demoen viser akkurat nå – avledet fra prototypens adresse og fase. */
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

/** Telefonen med den ekte prototypen. Ligger alltid i salen (lastes én gang), og vises bare i demoen. */
export function DemoTelefon({ visning, demoNr }: { visning: Visning; demoNr: number }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [forklaring, setForklaring] = useState<Forklaring>(FORKLARINGER.start)
  const [sett, setSett] = useState<string[]>([])

  // Ny demo: rene data og last på nytt
  useEffect(() => {
    klargjorPrototype()
    setSett([])
    const f = ref.current
    if (f) f.src = `demo/vaktlogg.html?n=${demoNr}`
  }, [demoNr])

  // Følg med på hvor C er i prototypen, og send det til presentatørvinduet
  useEffect(() => {
    if (visning === 'skjult') return
    const id = window.setInterval(() => {
      const fk = lesForklaring(ref.current?.contentWindow ?? null)
      setForklaring((g) => (g.id === fk.id ? g : fk))
      setSett((s) => (s.includes(fk.id) ? s : [...s, fk.id]))
    }, 400)
    return () => clearInterval(id)
  }, [visning])

  useEffect(() => {
    sendStatus({ film: 'klar', demo: forklaring.tittel })
  }, [forklaring])

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

  const x = visning === 'demo' ? DEMO_X : 960
  return (
    <>
      <motion.div
        className="demo-telefon"
        style={{ width: VW + KANT * 2, height: VH + KANT * 2, left: 960 - (VW + KANT * 2) / 2, top: 540 - (VH + KANT * 2) / 2, scale: SKALA }}
        initial={false}
        animate={{ x: x - 960, opacity: visning === 'skjult' ? 0 : 1 }}
        transition={{ x: { duration: 1.6, ease: FILM }, opacity: { duration: visning === 'film' ? 0.5 : 0.4 } }}
        aria-hidden={visning === 'skjult'}
      >
        <iframe ref={ref} title="Vaktlogg – prototypen" className="demo-ramme" style={{ width: VW, height: VH, borderRadius: meta.skjermHjorne * VH }} onLoad={kobleTaster} tabIndex={visning === 'skjult' ? -1 : 0} />
      </motion.div>

      <AnimatePresence>
        {visning === 'demo' && (
          <motion.aside key="forklaring" className="demo-forklaring" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 1, delay: 0.9, ease: MYK }}>
            <span className="overtittel">Hva du ser – og hvorfor</span>
            <AnimatePresence mode="wait">
              <motion.div key={forklaring.id} className="forklaring-kort" initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }} transition={{ duration: 0.6, ease: MYK }}>
                <small style={{ color: forklaring.farge }}>{forklaring.over}</small>
                <b className="stor-serif">{forklaring.tittel}</b>
                <p>{forklaring.innsikt}</p>
              </motion.div>
            </AnimatePresence>
            <div className="demo-spor">
              {['start', 'salg', 'konkurranse', 'helse', 'sjef', 'slutt'].map((k) => (
                <span key={k} className={sett.includes(k) ? 'sett' : ''} style={{ ['--f' as string]: FORKLARINGER[k].farge }}>
                  {FORKLARINGER[k].tittel}
                </span>
              ))}
            </div>
            <p className="demo-merk">Konseptprototype · fiktiv restaurant · simulerte data</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

/** Selve scenen: filmen i første takt. Telefonen (DemoTelefon) styres fra salen ut fra takten. */
export function Demo({ takt, onVisning }: SceneProps & { onVisning: (v: Visning) => void }) {
  useLys(0)
  const video = useRef<HTMLVideoElement>(null)
  const [ferdig, setFerdig] = useState(takt > 0)

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
    v.currentTime = 0
    v.play().catch(() => setFerdig(true))
    // Når filmen står stille på siste bilde, legges den ekte prototypen oppå
    const id = window.setInterval(() => {
      if (v.currentTime >= meta.stilleFra + 0.15 || v.ended) {
        onVisning('film')
        clearInterval(id)
      }
    }, 50)
    return () => clearInterval(id)
  }, [takt, onVisning])

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
        onError={() => {
          setFerdig(true)
          onVisning('film')
        }}
        animate={{ opacity: takt > 0 ? 0 : 1 }}
        transition={{ duration: 1.2, ease: MYK }}
      />
      {/* Reserve hvis filmen mangler: telefonen tones rett inn */}
      {ferdig && takt === 0 && <div className="demo-reserve" />}
      <motion.div className="demo-glod" initial={{ opacity: 0 }} animate={{ opacity: takt > 0 ? 1 : 0 }} transition={{ duration: 2 }} />
    </div>
  )
}
