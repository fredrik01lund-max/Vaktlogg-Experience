import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { manus } from '../content/manus.ts'
import type { Fase, Hvem } from '../content/types.ts'
import { filmTilstand } from '../lib/film.ts'
import { FARGE, oppsett } from '../lib/oppsett.ts'
import { apneVindu, forrige, gaTil, hent, neste, nyDemo, sendStatus, start, svart, useTilstand, velg } from '../lib/sync.ts'
import { Apning, Innsikter, Metode, Portrett, TittelScene } from '../scenes/Del1.tsx'
import { Ide, Persona, Prinsipper, Sensor, Snu, ToInnsikter } from '../scenes/Del2.tsx'
import { Nabc, Refleksjon, Slutt, Testing, Videre } from '../scenes/Del3.tsx'
import { Demo, DemoTelefon } from '../scenes/Demo.tsx'
import { MYK, useLysNivaa, type SceneProps } from '../scenes/felles.tsx'
import { vekslePlassholdertekst } from '../ui/Foto.tsx'
import { Lys } from '../ui/Lys.tsx'

const SCENER: Record<string, ComponentType<SceneProps>> = {
  apning: Apning,
  tittel: TittelScene,
  metode: Metode,
  portrett: Portrett,
  innsikter: Innsikter,
  snu: Snu,
  persona: Persona,
  ide: Ide,
  'to-innsikter': ToInnsikter,
  prinsipper: Prinsipper,
  sensor: Sensor,
  testing: Testing,
  nabc: Nabc,
  refleksjon: Refleksjon,
  videre: Videre,
  slutt: Slutt,
}

// Prototypen lastes fra designprinsippene (to scener før demoen) til scenen etter
const DEMO_I = manus.findIndex((s) => s.id === 'demo')

const FASER: { id: Fase; navn: string }[] = [
  { id: 'empathize', navn: 'Empathize' },
  { id: 'define', navn: 'Define' },
  { id: 'ideate', navn: 'Ideate' },
  { id: 'prototype', navn: 'Prototype' },
  { id: 'test', navn: 'Test' },
]

/** Skalerer lerretet (1920 × 1080) til vinduet, med svarte kanter ved andre formater. */
function useSkala() {
  const [s, setS] = useState({ k: 1, x: 0, y: 0 })
  useLayoutEffect(() => {
    const opp = () => {
      const k = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
      setS({ k, x: (window.innerWidth - 1920 * k) / 2, y: (window.innerHeight - 1080 * k) / 2 })
    }
    opp()
    window.addEventListener('resize', opp)
    return () => window.removeEventListener('resize', opp)
  }, [])
  return s
}

export function Salen() {
  const t = useTilstand()
  const skala = useSkala()
  const lys = useLysNivaa()
  const scene = manus[t.scene]
  const takt = scene.takter[t.takt]
  const [demoVisning, setDemoVisning] = useState<'skjult' | 'film' | 'demo'>('skjult')
  const [oversikt, setOversikt] = useState(false)
  const [hjelp, setHjelp] = useState(false)
  const [peker, setPeker] = useState(true)
  const lyd = useRef<HTMLAudioElement>(null)

  // ── Tastatur og klikker ──
  useEffect(() => {
    const ned = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const k = e.key
      if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(k)) {
        e.preventDefault()
        if (oversikt || hjelp) return
        neste()
      } else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) {
        e.preventDefault()
        forrige()
      } else if (k === 'F5' || k === 'Escape') {
        // Klikkere sender F5/Esc på «spill av»-knappen – aldri last siden på nytt midt i
        e.preventDefault()
        setOversikt(false)
        setHjelp(false)
      } else if (k === 'b' || k === 'B' || k === '.') svart()
      else if (k === 'p' || k === 'P') apneVindu('presentator')
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen().catch(() => {})
      } else if (k === 'o' || k === 'O') setOversikt((v) => !v)
      else if (k === 'h' || k === 'H' || k === '?') setHjelp((v) => !v)
      else if (k === 'l' || k === 'L') vekslePlassholdertekst()
      else if (k === 'Home') gaTil(0)
      else if (k === 'r' || k === 'R') nyDemo()
      else if (/^[1-4]$/.test(k) && manus[t.scene].id === 'sensor') velg(Number(k))
    }
    window.addEventListener('keydown', ned)
    return () => window.removeEventListener('keydown', ned)
  }, [oversikt, hjelp, t.scene])

  // ── Stille sekvenser går videre av seg selv (bare hovedskjermen styrer dette) ──
  useEffect(() => {
    if (!t.startet || !takt.auto) return
    const igjen = takt.auto * 1000 - (Date.now() - t.taktFra)
    const s = t.scene
    const k = t.takt
    const id = window.setTimeout(() => {
      // Bare hvis ingen har klikket videre i mellomtiden
      const naa = hent()
      if (naa.scene === s && naa.takt === k) neste()
    }, Math.max(0, igjen))
    return () => clearTimeout(id)
  }, [t.startet, t.scene, t.takt, t.taktFra, takt.auto])

  // ── Status til presentatørvinduet (er filmen lastet, er hovedskjermen her) ──
  useEffect(() => {
    const id = window.setInterval(() => sendStatus({ film: filmTilstand(), demo: '' }), 2000)
    sendStatus({ film: filmTilstand(), demo: '' })
    return () => clearInterval(id)
  }, [])

  // ── Valgfri restaurantlyd i åpningen ──
  useEffect(() => {
    const a = lyd.current
    if (!a || !oppsett.lyd.apning) return
    if (t.startet && scene.id === 'apning') {
      a.volume = 0
      a.currentTime = 0
      a.play().catch(() => {})
      let v = 0
      const id = window.setInterval(() => {
        v = Math.min(oppsett.lyd.volum, v + 0.02)
        a.volume = v
      }, 100)
      return () => clearInterval(id)
    }
    // Ton ut
    const id = window.setInterval(() => {
      a.volume = Math.max(0, a.volume - 0.02)
      if (a.volume <= 0) {
        a.pause()
        clearInterval(id)
      }
    }, 100)
    return () => clearInterval(id)
  }, [t.startet, scene.id])

  // Skjul pekeren når den ikke brukes
  useEffect(() => {
    let id = 0
    const flytt = () => {
      setPeker(true)
      clearTimeout(id)
      id = window.setTimeout(() => setPeker(false), 2500)
    }
    window.addEventListener('mousemove', flytt)
    return () => window.removeEventListener('mousemove', flytt)
  }, [])

  // Navnelinjen når en ny presentatør tar over
  const [navnelinje, setNavnelinje] = useState<Hvem | null>(null)
  const sistVist = useRef<Hvem | null>(null)
  useEffect(() => {
    const h = takt.hvem
    if (!t.startet || (h !== 'A' && h !== 'B' && h !== 'C')) return
    if (scene.id === 'tittel') {
      sistVist.current = 'A' // navnene står allerede på tittelen
      return
    }
    if (h === sistVist.current) return
    sistVist.current = h
    setNavnelinje(h)
  }, [t.startet, t.scene, t.takt, takt.hvem, scene.id])
  useEffect(() => {
    if (!navnelinje) return
    const id = window.setTimeout(() => setNavnelinje(null), 5000)
    return () => clearTimeout(id)
  }, [navnelinje])

  const settVisning = useCallback((v: 'skjult' | 'film' | 'demo') => setDemoVisning(v), [])
  const Scene = SCENER[scene.id]
  const fremdrift = ((t.scene + (t.takt + 1) / scene.takter.length) / manus.length) * 100

  return (
    <div className={`salen ${peker ? '' : 'skjul-peker'}`} onDoubleClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}>
      <div className="lerret" style={{ transform: `translate(${skala.x}px, ${skala.y}px) scale(${skala.k})` }}>
        <Lys styrke={t.startet ? lys : 0.25} />

        {!t.startet ? (
          <div className="venter">
            <div>
              <div className="tittel">VAKTLOGG EXPERIENCE</div>
              <p>
                <kbd>→</kbd> eller klikker for å starte · <kbd>P</kbd> presentatørvisning · <kbd>F</kbd> fullskjerm · <kbd>H</kbd> hjelp
              </p>
              <button className="venter-start" onClick={start}>
                Start
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="sync">
            <motion.div key={scene.id} className="scene-ramme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: scene.id === 'tittel' ? 0.01 : 0.9, ease: MYK }}>
              {scene.id === 'demo' ? <Demo takt={t.takt} valg={t.valg} onVisning={settVisning} /> : <Scene takt={t.takt} valg={t.valg} />}
            </motion.div>
          </AnimatePresence>
        )}

        <DemoTelefon visning={t.startet && scene.id === 'demo' ? demoVisning : 'skjult'} demoNr={t.demoNr} last={t.startet && t.scene >= DEMO_I - 2 && t.scene <= DEMO_I + 1} />

        {t.startet && scene.fase && (
          <div className={`faser ${scene.id === 'demo' ? 'hoyre' : ''}`} aria-hidden="true">
            {scene.id === 'testing' && (
              <svg className="sloyfe" width="560" height="30" viewBox="0 0 560 30">
                <path d="M520 26 C 500 2, 230 2, 210 24" fill="none" stroke="#F6A2C8" strokeWidth="1.5" strokeDasharray="4 5" markerEnd="url(#sloyfePil)" />
                <defs>
                  <marker id="sloyfePil" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0L10 5L0 10z" fill="#F6A2C8" />
                  </marker>
                </defs>
              </svg>
            )}
            {FASER.map((f) => (
              <span key={f.id} className={f.id === scene.fase ? 'na' : ''}>
                {f.navn}
              </span>
            ))}
          </div>
        )}

        <AnimatePresence>
          {navnelinje && (
            <motion.div key={navnelinje} className="navnelinje" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.9, ease: MYK }}>
              <span className="strek" style={{ background: FARGE[navnelinje] }} />
              <span>
                <b>{oppsett.presentatorer[navnelinje].navn}</b>
                <small>{oppsett.presentatorer[navnelinje].rolle}</small>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {t.startet && <div className="fremdrift" style={{ width: `${fremdrift}%` }} />}
        <div className="vignett" />
        <div className="korn" />
        <div className="blackout" style={{ opacity: t.svart ? 1 : 0 }} />

        {oversikt && (
          <div className="oversikt" onClick={() => setOversikt(false)}>
            <h2>Scener</h2>
            <ol>
              {manus.map((s, i) => (
                <li key={s.id}>
                  <button
                    className={i === t.scene ? 'na' : ''}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!t.startet) start()
                      gaTil(i)
                      setOversikt(false)
                    }}
                  >
                    <small>
                      {String(i + 1).padStart(2, '0')} · {s.del}
                    </small>
                    <b>{s.tittel}</b>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
        {hjelp && (
          <div className="hjelp" onClick={() => setHjelp(false)}>
            <h2>Taster</h2>
            <dl>
              <dt><kbd>→</kbd> <kbd>mellomrom</kbd> <kbd>PageDown</kbd></dt>
              <dd>Neste (klikkeren virker også inne i prototypen)</dd>
              <dt><kbd>←</kbd> <kbd>PageUp</kbd></dt>
              <dd>Forrige</dd>
              <dt><kbd>P</kbd></dt>
              <dd>Åpne presentatørvisningen i eget vindu (dra det til din skjerm)</dd>
              <dt><kbd>F</kbd></dt>
              <dd>Fullskjerm (eller dobbeltklikk)</dd>
              <dt><kbd>1</kbd>–<kbd>4</kbd></dt>
              <dd>Sensors valg i designvalget</dd>
              <dt><kbd>B</kbd> <kbd>.</kbd></dt>
              <dd>Svart skjerm av/på</dd>
              <dt><kbd>O</kbd></dt>
              <dd>Oversikt over scenene – hopp dit du vil</dd>
              <dt><kbd>R</kbd></dt>
              <dd>Last prototypen på nytt med rene data</dd>
              <dt><kbd>L</kbd></dt>
              <dd>Skjul/vis teksten på fotoplassholdere</dd>
            </dl>
          </div>
        )}
      </div>
      {oppsett.lyd.apning && <audio ref={lyd} src={oppsett.lyd.apning} preload="auto" loop />}
    </div>
  )
}
