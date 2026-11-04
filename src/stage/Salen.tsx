import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { lagtTilSide } from '../content/arkiv.ts'
import { manus } from '../content/manus.ts'
import type { Fase, Hvem } from '../content/types.ts'
import { filmTilstand } from '../lib/film.ts'
import { mobilAdresse, romkode, speilmodus, startMobilvakt } from '../lib/mobil.ts'
import { FARGE, oppsett } from '../lib/oppsett.ts'
import { apneVindu, forrige, gaTil, hent, neste, nyDemo, paLydtest, sendStatus, start, svart, useTilstand } from '../lib/sync.ts'
import { Innsikter, Metode, Portrett, TittelScene } from '../scenes/Del1.tsx'
import { Ide, Pakket, Persona, Prinsipper, Sensor, Snu, ToInnsikter } from '../scenes/Del2.tsx'
import { Hopping, Nabc, Refleksjon, Slutt, Testing, Videre } from '../scenes/Del3.tsx'
import { Demo, DemoTelefon } from '../scenes/Demo.tsx'
import { Folk, Funn, Prioritert, Valg, Vakten, Vet } from '../scenes/Flyt.tsx'
import { MYK, useLysNivaa, type SceneProps } from '../scenes/felles.tsx'
import { vekslePlassholdertekst } from '../ui/Foto.tsx'
import { Lys } from '../ui/Lys.tsx'

const SCENER: Record<string, ComponentType<SceneProps>> = {
  vakten: Vakten,
  folk: Folk,
  funn: Funn,
  snu: Snu,
  valg: Valg,
  prioritert: Prioritert,
  hopping: Hopping,
  vet: Vet,
  slutt: Slutt,
}

// Lagt til side (src/content/arkiv.ts): kan vises fra oversikten, men er ikke med i flyten
const ARKIV: Record<string, ComponentType<SceneProps>> = {
  tittel: TittelScene,
  metode: Metode,
  portrett: Portrett,
  innsikter: Innsikter,
  ide: Ide,
  'to-innsikter': ToInnsikter,
  pakket: Pakket,
  refleksjon: Refleksjon,
  videre: Videre,
  persona: Persona,
  prinsipper: Prinsipper,
  sensor: Sensor,
  testing: Testing,
  nabc: Nabc,
}

// Prototypen lastes fra scenen før demoen (Det vi prioriterte) til scenen etter
const DEMO_I = manus.findIndex((s) => s.id === 'demo')

const FASER: { id: Fase; navn: string }[] = [
  { id: 'empathize', navn: 'Empathize' },
  { id: 'define', navn: 'Define' },
  { id: 'ideate', navn: 'Ideate' },
  { id: 'prototype', navn: 'Prototype' },
  { id: 'test', navn: 'Test' },
]

/** Fullskjerm, og fang Esc (Chrome/Edge): klikkerens «spill av»-knapp sender ofte Esc, som ellers avslutter fullskjermen. */
function fullskjerm() {
  document.documentElement
    .requestFullscreen?.()
    .then(() => (navigator as Navigator & { keyboard?: { lock?: (k: string[]) => Promise<void> } }).keyboard?.lock?.(['Escape']))
    .catch(() => {})
}

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
  const scene = manus[t.scene] ?? manus[0]
  const takt = scene.takter[t.takt] ?? scene.takter[0]
  const [demoVisning, setDemoVisning] = useState<'skjult' | 'film' | 'demo'>('skjult')
  const [oversikt, setOversikt] = useState(false)
  const [hjelp, setHjelp] = useState(false)
  const [arkiv, setArkiv] = useState<{ i: number; takt: number; valg: number | null } | null>(null)
  const [peker, setPeker] = useState(true)
  const lyd = useRef<HTMLAudioElement>(null)

  // Hold skjermen våken: PC-en får ingen tastetrykk i minuttene sensor bruker mobilen (localhost er en sikker kontekst)
  useEffect(() => {
    let laas: WakeLockSentinel | null = null
    const be = () => {
      if (document.visibilityState !== 'visible') return
      navigator.wakeLock
        ?.request('screen')
        .then((l) => (laas = l))
        .catch(() => {})
    }
    be()
    document.addEventListener('visibilitychange', be)
    return () => {
      document.removeEventListener('visibilitychange', be)
      laas?.release().catch(() => {})
    }
  }, [])

  // ── Tastatur og klikker ──
  useEffect(() => {
    const ned = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const k = e.key
      if (arkiv) {
        e.preventDefault()
        const n = lagtTilSide[arkiv.i].takter.length
        if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(k)) setArkiv({ ...arkiv, takt: Math.min(n - 1, arkiv.takt + 1) })
        else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) setArkiv({ ...arkiv, takt: Math.max(0, arkiv.takt - 1) })
        else if (/^[1-4]$/.test(k)) setArkiv({ ...arkiv, valg: Number(k), takt: n - 1 })
        else if (k === 'Escape' || k === 'F5' || k === 'o' || k === 'O') setArkiv(null)
        return
      }
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
        else fullskjerm()
      } else if (k === 'o' || k === 'O') setOversikt((v) => !v)
      else if (k === 'h' || k === 'H' || k === '?') setHjelp((v) => !v)
      else if (k === 'l' || k === 'L') vekslePlassholdertekst()
      else if (k === 'Home') gaTil(0)
      else if (k === 'r' || k === 'R') nyDemo()
    }
    window.addEventListener('keydown', ned)
    return () => window.removeEventListener('keydown', ned)
  }, [oversikt, hjelp, arkiv])

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

  // ── Status til presentatørvinduet (er filmen lastet, er hovedskjermen her, er sensors mobil koblet til) ──
  const [mobilInfo, setMobilInfo] = useState('')
  useEffect(() => {
    const id = window.setInterval(() => sendStatus({ film: filmTilstand() }), 2000)
    sendStatus({ film: filmTilstand() })
    startMobilvakt()
    speilmodus().then((m) => setMobilInfo(m === 'rele' ? `${mobilAdresse()} og skriv koden ${romkode()}` : 'http://<IP>:8080/s (adressen står i terminalen)'))
    return () => clearInterval(id)
  }, [])

  // ── «Test lyd» fra presentatørvisningen: hovedskjermen spiller Sir Domeos første replikk ──
  useEffect(
    () =>
      paLydtest(() => {
        new Audio('demo/domeo/sensor-0.mp3').play().catch(() => {})
      }),
    [],
  )

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
  const tema = t.startet ? (scene.tema ?? 'lys') : 'mork'
  const fremdrift = ((t.scene + (t.takt + 1) / scene.takter.length) / manus.length) * 100

  return (
    <div className={`salen ${peker ? '' : 'skjul-peker'}`} onDoubleClick={fullskjerm}>
      <div className={`lerret tema-${tema}`} style={{ transform: `translate(${skala.x}px, ${skala.y}px) scale(${skala.k})` }}>
        <Lys styrke={t.startet ? lys : 0.25} tema={tema} />

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

        {/* Lagt til side: en arkivert scene vises over flyten til Esc trykkes (flyten står stille imens) */}
        {arkiv && <ArkivVisning i={arkiv.i} takt={arkiv.takt} valg={arkiv.valg} />}

        <DemoTelefon visning={t.startet && scene.id === 'demo' && !arkiv ? demoVisning : 'skjult'} demoNr={t.demoNr} last={t.startet && t.scene >= DEMO_I - 1 && t.scene <= DEMO_I + 1} sensor={t.startet && scene.id === 'demo' && takt.hvem === 'sensor'} overlevering={t.startet && scene.id === 'demo' && t.takt === 1} />

        {t.startet && scene.fase && !arkiv && (
          <div className={`faser ${scene.id === 'demo' ? 'hoyre' : ''} ${['funn', 'demo', 'hopping'].includes(scene.id) ? 'pa-film' : ''} ${takt.hvem === 'stille' && takt.anim ? 'under-film' : ''}`} aria-hidden="true">
            {scene.id === 'hopping' && (
              <svg className="sloyfe" width="560" height="30" viewBox="0 0 560 30">
                <path d="M520 26 C 500 2, 230 2, 210 24" fill="none" stroke="#F08FB0" strokeWidth="1.5" strokeDasharray="4 5" markerEnd="url(#sloyfePil)" />
                <defs>
                  <marker id="sloyfePil" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0L10 5L0 10z" fill="#F08FB0" />
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
            <h2 className="oversikt-arkiv">Lagt til side</h2>
            <ol className="oversikt-arkiv">
              {lagtTilSide.map((s, i) => (
                <li key={s.id}>
                  <button
                    disabled={!ARKIV[s.id]}
                    title={ARKIV[s.id] ? 'Vis scenen (Esc lukker)' : 'Bare manuset – se src/content/arkiv.ts'}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!t.startet) start()
                      setArkiv({ i, takt: 0, valg: null })
                      setOversikt(false)
                    }}
                  >
                    <small>{s.del}{ARKIV[s.id] ? '' : ' · bare manus'}</small>
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

              <dt><kbd>B</kbd> <kbd>.</kbd></dt>
              <dd>Svart skjerm av/på</dd>
              <dt><kbd>O</kbd></dt>
              <dd>Oversikt over scenene – hopp dit du vil. Under «Lagt til side» ligger scenene vi tok ut (Esc lukker)</dd>
              <dt><kbd>R</kbd></dt>
              <dd>Last prototypen på nytt med rene data (starter også omvisningen på sensors mobil på nytt)</dd>
              <dt><kbd>L</kbd></dt>
              <dd>Skjul/vis teksten på fotoplassholdere</dd>
            </dl>
            {mobilInfo && <p className="hjelp-mobil">Sensors mobil: åpne {mobilInfo}</p>}
          </div>
        )}
      </div>
      {oppsett.lyd.apning && <audio ref={lyd} src={oppsett.lyd.apning} preload="auto" loop />}
    </div>
  )
}

function ArkivVisning({ i, takt, valg }: { i: number; takt: number; valg: number | null }) {
  const s = lagtTilSide[i]
  const Scene = ARKIV[s.id]
  return (
    <div className="arkiv-visning">
      {Scene && <Scene takt={takt} valg={valg} />}
      <div className="arkiv-merke">
        Lagt til side · {s.tittel} · takt {takt + 1}/{s.takter.length} · <kbd>Esc</kbd> tilbake
      </div>
    </div>
  )
}
