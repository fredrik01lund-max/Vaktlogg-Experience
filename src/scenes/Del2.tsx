import { motion } from 'motion/react'
import { Flipp } from '../ui/Deler.tsx'
import { FILM, Inn, MYK, useLys, useSek, type SceneProps } from './felles.tsx'

/* ══ 6. Problemet snur: SYKEFRAVÆR → MOTIVASJON ════════════════════════════════════
   Begge ordene har ti bokstaver – flippbokstavene viser omdefineringen bokstavelig. */

const PEKTE_PA = [
  { t: 'Lav lønn', x: -620, y: -250 },
  { t: 'Høyt arbeidstempo', x: 560, y: -270 },
  { t: 'Fysisk belastning', x: -700, y: 210 },
  { t: 'Begrenset anerkjennelse', x: 560, y: 230 },
]

export function Snu({ takt }: SceneProps) {
  useLys(0.12)
  return (
    <div className="scene snu">
      <Inn vis={takt === 0} className="overtittel snu-over">
        Det informantene pekte på
      </Inn>
      <div className="snu-midt">
        {PEKTE_PA.map((p, i) => (
          <motion.span
            key={p.t}
            className="merket snu-brikke"
            initial={{ opacity: 0, x: p.x * 0.7, y: p.y * 0.7 }}
            animate={takt === 0 ? { opacity: 1, x: p.x, y: [p.y, p.y - 12, p.y] } : { opacity: 0, x: 0, y: 0, scale: 0.6 }}
            transition={takt === 0 ? { duration: 1.2, delay: 0.3 + i * 0.25, ease: MYK, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } } : { duration: 0.9, ease: MYK }}
          >
            {p.t}
          </motion.span>
        ))}
        <motion.div className="snu-motsatt" initial={{ opacity: 0, y: 30 }} animate={{ opacity: takt === 0 ? 1 : 0, y: takt === 0 ? 0 : 30 }} transition={{ duration: 1.2, delay: takt === 0 ? 2.6 : 0, ease: MYK }}>
          Men noen gikk på jobb syke – for ikke å svikte kollegene.
        </motion.div>

        <motion.div animate={{ y: takt >= 1 ? -90 : 0, scale: takt >= 2 ? 0.72 : 1 }} transition={{ duration: 1.4, delay: takt === 1 ? 4.6 : 0, ease: MYK }}>
          <Flipp fra="SYKEFRAVÆR" til="MOTIVASJON" start={takt >= 1} />
        </motion.div>

        <Inn vis={takt >= 1} d={takt === 1 ? 4.9 : 0} className="snu-sporsmal stor-serif" tid={1.6}>
          Hvordan kan vi øke motivasjonen i jobben som servitør?
        </Inn>
      </div>

      <div className="snu-pil">
        <Inn vis={takt >= 2} d={0.4} className="snu-pil-del">
          <small>Fra</small> en bred utfordring i bransjen
        </Inn>
        <Inn vis={takt >= 2} d={0.8} className="snu-pil-strek">
          <svg width="120" height="20" viewBox="0 0 120 20">
            <path d="M2 10H112M104 3l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Inn>
        <Inn vis={takt >= 2} d={1.2} className="snu-pil-del">
          <small>Til</small> noe vi kan påvirke med tjenestedesign
        </Inn>
      </div>
      <Inn vis={takt >= 1} d={takt === 1 ? 6.2 : 0.3} className="fotnote snu-fotnote">
        Vi har ikke dokumentert at lav motivasjon er en direkte årsak til sykefravær.
      </Inn>
    </div>
  )
}

/* ══ 7. Persona og brukerreise ═══════════════════════════════════════════════════ */

const FASER = [
  { navn: 'Før vakten', ned: [] as string[], opp: [] as string[] },
  { navn: 'Under vakten', ned: ['Stor arbeidsbelastning', 'Manglende pauser', 'Lite tilbakemelding fra ledelsen'], opp: ['Gode kolleger', 'Positive gjesteopplevelser'] },
  { navn: 'Etter vakten', ned: [], opp: [] },
  { navn: 'Dagene etter', ned: [], opp: [] },
]

export function Persona({ takt }: SceneProps) {
  useLys(0.15)
  return (
    <div className="scene persona">
      <Inn className="persona-kort" x={-40} y={0}>
        <div className="persona-monogram">T</div>
        <span className="merket fiktiv">Fiktiv persona · satt sammen av innsikter</span>
        <h2 className="stor-serif">Theodora</h2>
        <p className="persona-fakta">26 år · servitør på Aker Brygge</p>
        <ul>
          <li>Jobber mye</li>
          <li>Stiller opp når andre er syke</li>
          <li>Opplever at innsatsen ikke alltid blir verdsatt</li>
        </ul>
      </Inn>

      <div className="reise">
        <Inn vis={takt >= 1} className="overtittel reise-over">
          Brukerreisen
        </Inn>
        <svg className="reise-kurve" viewBox="0 0 1040 300" aria-hidden="true">
          <defs>
            <linearGradient id="reiseG" x1="0" x2="1">
              <stop offset="0" stopColor="#FFC896" />
              <stop offset="0.5" stopColor="#FDB8B4" />
              <stop offset="1" stopColor="#F6A2C8" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 150 C 90 140, 170 130, 260 150 C 320 170, 340 240, 380 230 C 420 220, 430 90, 470 100 C 510 110, 500 220, 540 210 C 570 200, 600 120, 630 160 C 680 230, 700 260, 780 262 C 860 264, 940 258, 1040 256"
            fill="none"
            stroke="url(#reiseG)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: takt >= 1 ? 1 : 0 }}
            transition={{ duration: 3, ease: FILM }}
          />
          {[260, 520, 780].map((x) => (
            <motion.line key={x} x1={x} x2={x} y1="10" y2="290" stroke="rgba(244,237,228,0.14)" strokeDasharray="4 6" initial={{ opacity: 0 }} animate={{ opacity: takt >= 1 ? 1 : 0 }} />
          ))}
        </svg>
        <motion.div className="mulighet-glod" initial={{ opacity: 0 }} animate={{ opacity: takt >= 2 ? 1 : 0 }} transition={{ duration: 1.4 }} />
        <div className="reise-faser">
          {FASER.map((f, i) => (
            <Inn key={f.navn} vis={takt >= 1} d={0.3 + i * 0.5} className={`reise-fase ${i === 2 && takt >= 2 ? 'mulighet' : ''}`}>
              <b>{f.navn}</b>
              {f.opp.map((o) => (
                <span key={o} className="pluss">
                  {o}
                </span>
              ))}
              {f.ned.map((o) => (
                <span key={o} className="minus">
                  {o}
                </span>
              ))}
              {i === 2 && (
                <motion.div className="mulighet-tekst" initial={{ opacity: 0, y: 12 }} animate={{ opacity: takt >= 2 ? 1 : 0, y: takt >= 2 ? 0 : 12 }} transition={{ duration: 1, delay: 0.6 }}>
                  <em>Mulighetsrommet</em>
                  <span>Egne resultater</span>
                  <span>Utvikling</span>
                  <span>Anerkjennelse</span>
                </motion.div>
              )}
            </Inn>
          ))}
        </div>
        <Inn vis={takt >= 1} d={2.6} className="reise-merk">
          <span className="merket illustrasjon">Kvalitativ illustrasjon – ikke målt</span>
        </Inn>
      </div>
    </div>
  )
}

/* ══ 8. Den første ideen: Strava for jobben ══════════════════════════════════════ */

export function Ide({ takt }: SceneProps) {
  useLys(0.15)
  return (
    <div className="scene ide">
      <motion.div className="ide-skisse" animate={{ y: takt >= 1 ? -170 : 0, scale: takt >= 1 ? 0.8 : 1, opacity: takt >= 1 ? 0.5 : 1 }} transition={{ duration: 1.2, ease: MYK }}>
        <Inn className="overtittel">Første konseptidé</Inn>
        <Inn d={0.2} className="ide-tittel stor-serif">
          «Strava for jobben»
        </Inn>
        <div className="ide-flyt">
          {['Stempler inn', 'Skrittelleren går', 'Stempler ut'].map((s, i) => (
            <Inn key={s} d={0.8 + i * 0.5} className="ide-steg">
              <span>{i === 0 ? 'f.eks. i Planday' : i === 1 ? 'under hele vakten' : 'når vakten er over'}</span>
              <b>{s}</b>
            </Inn>
          ))}
          <svg className="ide-piler" viewBox="0 0 1000 40" aria-hidden="true">
            <motion.path d="M290 20H370M630 20H710" stroke="rgba(244,237,228,0.5)" strokeWidth="2" strokeDasharray="6 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 1.4 }} />
          </svg>
        </div>
      </motion.div>

      <div className="historie">
        <Inn vis={takt >= 1} d={0.3} className="historie-tall" style={{ color: 'var(--aktivitet)' }}>
          <b>+ ca. 5 000</b>
          <span>skritt mer enn vanlig – hun lærte blant annet opp en ny kollega</span>
        </Inn>
        <Inn vis={takt >= 1} d={0.9} className="historie-tall" style={{ color: 'var(--salg)' }}>
          <b>3 flasker vin</b>
          <span>solgt samme vakt</span>
        </Inn>
        <Inn vis={takt >= 1} d={1.6} className="historie-sitat stor-serif">
          Hun beskrev den ekstra innsatsen som verdt det.
        </Inn>
        <Inn vis={takt >= 1} d={2} className="historie-merk">
          <span className="merket illustrasjon">Gjenfortalt fra ett intervju · selvrapportert</span>
        </Inn>
      </div>
    </div>
  )
}

/* ══ 9. To innsikter, én idé (stille, 13 s) ═══════════════════════════════════════
   Skrittene (aktivitet) går inn fra venstre og blir ringen i Vaktlogg-merket.
   Salgssøylene vokser fra høyre og blir V-en. Gnisten til slutt er anerkjennelsen. */

const R = 168
const SENTER = { x: 960, y: 460 }
const SKALA = 1.12
// Skritt langs en svingete sti inn fra venstre
const SKRITT = Array.from({ length: 26 }, (_, i) => {
  const p = i / 25
  const x = 120 + p * 640
  const y = 560 + Math.sin(p * Math.PI * 2.4) * 90 + (i % 2 ? 16 : -16)
  // Målet: punkt på ringen (280° bue, fra prikken og rundt)
  const vinkel = (-45 + 0) * (Math.PI / 180) - p * (280 * Math.PI) / 180
  const mx = SENTER.x + Math.cos(vinkel) * R * SKALA
  const my = SENTER.y - Math.sin(vinkel) * R * SKALA
  return { x, y, mx, my, rot: i % 2 ? 12 : -12 }
})
const SOYLER = [0.35, 0.5, 0.42, 0.7, 0.62, 0.9, 0.78]

export function ToInnsikter({ takt }: SceneProps) {
  const t = useSek()
  useLys(t > 8 ? 0.6 : 0.12)
  const fase = t < 0.4 ? 0 : t < 4.6 ? 1 : t < 8.2 ? 2 : 3 // 1: hver for seg · 2: møtes · 3: merket
  const s = SKALA
  const cx = SENTER.x
  const cy = SENTER.y
  return (
    <div className="scene to-innsikter">
      <svg viewBox="0 0 1920 1080" className="to-svg" aria-hidden="true">
        <defs>
          <linearGradient id="tiFlate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFC896" />
            <stop offset="0.55" stopColor="#FDB8B4" />
            <stop offset="1" stopColor="#F6A2C8" />
          </linearGradient>
          <linearGradient id="tiV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A63F69" />
            <stop offset="1" stopColor="#6E2A3C" />
          </linearGradient>
          <radialGradient id="tiGnist">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#F6A2C8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Merkeflaten kommer bak når de to har møttes */}
        <motion.rect x={cx - 256 * s} y={cy - 256 * s} width={512 * s} height={512 * s} rx={128 * s} fill="url(#tiFlate)" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: fase >= 3 ? 1 : 0, scale: fase >= 3 ? 1 : 0.6 }} style={{ transformOrigin: `${cx}px ${cy}px` }} transition={{ duration: 1.4, ease: MYK }} />

        {/* Skrittene → ringen */}
        {SKRITT.map((p, i) => (
          <motion.ellipse
            key={i}
            rx={9}
            ry={15}
            fill="#8FD9C0"
            initial={{ cx: p.x - 300, cy: p.y, opacity: 0, rotate: p.rot }}
            animate={
              fase === 0
                ? { cx: p.x - 300, cy: p.y, opacity: 0 }
                : fase === 1
                  ? { cx: p.x, cy: p.y, opacity: 0.95 }
                  : { cx: p.mx, cy: p.my, opacity: fase >= 3 ? 0 : 1, rx: 7, ry: 7 }
            }
            transition={fase === 1 ? { duration: 0.6, delay: i * 0.12, ease: MYK } : { duration: 1.6, delay: i * 0.03, ease: FILM }}
          />
        ))}
        <motion.circle cx={cx} cy={cy} r={R * s} fill="none" stroke="#fff" strokeOpacity="0.38" strokeWidth={40 * s} initial={{ opacity: 0 }} animate={{ opacity: fase >= 3 ? 1 : 0 }} transition={{ duration: 1 }} />
        <motion.path
          d={`M${cx + 137.6 * s} ${cy + 96.4 * s}A${R * s} ${R * s} 0 1 1 ${cx + 118.8 * s} ${cy - 118.8 * s}`}
          fill="none"
          stroke={fase >= 3 ? '#fff' : '#8FD9C0'}
          strokeWidth={40 * s}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: fase >= 2 ? 1 : 0, opacity: fase >= 2 ? 1 : 0 }}
          transition={{ duration: 2.2, delay: fase === 2 ? 1.2 : 0, ease: FILM }}
        />

        {/* Salgssøylene → V */}
        {SOYLER.map((h, i) => {
          const bx = 1240 + i * 70
          const hoyde = h * 300
          const venstre = i < 3.5
          const vx = venstre ? cx + (-70 + (i / 3) * 70) * s : cx + ((i - 3) / 3) * 70 * s
          const vy = venstre ? cy + (-56 + (i / 3) * 126) * s : cy + (70 - ((i - 3) / 3) * 126) * s
          return (
            <motion.rect
              key={i}
              width={38}
              rx={8}
              fill="#FFC896"
              initial={{ x: bx + 300, y: 760, height: 0, opacity: 0 }}
              animate={
                fase === 0
                  ? { x: bx + 300, y: 760, height: 0, opacity: 0 }
                  : fase === 1
                    ? { x: bx, y: 760 - hoyde, height: hoyde, opacity: 0.95 }
                    : { x: vx - 19, y: vy - 19, height: 38, opacity: fase >= 3 ? 0 : 1 }
              }
              transition={fase === 1 ? { duration: 0.9, delay: 0.5 + i * 0.22, ease: MYK } : { duration: 1.6, delay: i * 0.05, ease: FILM }}
            />
          )
        })}
        <motion.path
          d={`M${cx - 70 * s} ${cy - 56 * s}L${cx} ${cy + 70 * s}L${cx + 70 * s} ${cy - 56 * s}`}
          fill="none"
          stroke={fase >= 3 ? 'url(#tiV)' : '#FFC896'}
          strokeWidth={56 * s}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: fase >= 2 ? 1 : 0, opacity: fase >= 2 ? 1 : 0 }}
          transition={{ duration: 1.8, delay: fase === 2 ? 1.5 : 0, ease: FILM }}
        />

        {/* Anerkjennelsen: gnisten der ringen ender */}
        <motion.circle cx={cx + 118.8 * s} cy={cy - 118.8 * s} r={30 * s} fill="#fff" initial={{ scale: 0 }} animate={{ scale: fase >= 3 ? 1 : 0 }} style={{ transformOrigin: `${cx + 118.8 * s}px ${cy - 118.8 * s}px` }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.5 }} />
        <motion.circle cx={cx + 118.8 * s} cy={cy - 118.8 * s} r={14 * s} fill="#F59A6E" initial={{ scale: 0 }} animate={{ scale: fase >= 3 ? 1 : 0 }} style={{ transformOrigin: `${cx + 118.8 * s}px ${cy - 118.8 * s}px` }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.62 }} />
        <motion.circle cx={cx + 118.8 * s} cy={cy - 118.8 * s} r={120} fill="url(#tiGnist)" initial={{ opacity: 0, scale: 0.2 }} animate={fase >= 3 ? { opacity: [0, 0.9, 0], scale: [0.2, 1.6, 2.2] } : { opacity: 0 }} style={{ transformOrigin: `${cx + 118.8 * s}px ${cy - 118.8 * s}px` }} transition={{ duration: 1.4, delay: 0.5 }} />
      </svg>

      <motion.div className="ti-etikett venstre" style={{ color: 'var(--aktivitet)' }} initial={{ opacity: 0 }} animate={{ opacity: fase === 1 ? 1 : 0 }} transition={{ duration: 0.8, delay: fase === 1 ? 0.8 : 0 }}>
        <b>Skritt</b>
        <span>aktivitet</span>
      </motion.div>
      <motion.div className="ti-etikett hoyre" style={{ color: 'var(--salg)' }} initial={{ opacity: 0 }} animate={{ opacity: fase === 1 ? 1 : 0 }} transition={{ duration: 0.8, delay: fase === 1 ? 1.4 : 0 }}>
        <b>Salg</b>
        <span>resultater</span>
      </motion.div>
      <motion.div className="ti-etikett gnist" style={{ color: 'var(--anerkjennelse)', left: SENTER.x + 118.8 * SKALA + 70, top: SENTER.y - 118.8 * SKALA - 40 }} initial={{ opacity: 0 }} animate={{ opacity: fase >= 3 && t < 11.5 ? 1 : 0 }} transition={{ duration: 0.8, delay: 1 }}>
        + anerkjennelse
      </motion.div>

      <div className="ti-ord">
        <Inn vis={t > 10.2 || takt >= 1} className="ti-vaktlogg stor-serif" tid={1.4}>
          Vaktlogg
        </Inn>
        <Inn vis={takt >= 1} d={0.3} className="ti-linje">
          <span style={{ color: 'var(--aktivitet)' }}>Aktivitet</span> + <span style={{ color: 'var(--salg)' }}>salg</span> + <span style={{ color: 'var(--anerkjennelse)' }}>anerkjennelse</span>
          <em> – i én personlig tjeneste, med motivasjon som mål</em>
        </Inn>
      </div>
    </div>
  )
}

/* ══ 10. Innsikt blir designprinsipper ═══════════════════════════════════════════ */

const PRINSIPPER = [
  { tittel: 'Rettferdighet', fra: 'Ulike stasjoner, antall gjester og erfaring', i: 'Duellen måles mot egen vanlige kveld', ikon: 'vekt' },
  { tittel: 'Usynlig innsats', fra: 'Opplæring og hjelp til kolleger synes ikke i kassen', i: 'Kudos fra kolleger og takkekort fra lederen', ikon: 'hjerte' },
  { tittel: 'Frivillighet', fra: 'Ikke alle ønsker å konkurrere', i: 'Velg kveldens spill selv – eller rolig modus', ikon: 'valg' },
  { tittel: 'Personvern', fra: 'Måling av arbeid kan oppleves som overvåking', i: 'Lederen ser lagnivå – ikke tall per person', ikon: 'las' },
  { tittel: 'Fysisk belastning', fra: 'Jobben er allerede fysisk krevende', i: 'Skritt og puls bare til personlig innsikt', ikon: 'puls' },
  { tittel: 'Ansvarlig salg', fra: 'Risiko for uheldig mersalgspress', i: 'Mål over tid – og duellen gjelder desserter, ikke alkohol', ikon: 'glass' },
]

function Ikon({ navn }: { navn: string }) {
  const p: Record<string, string> = {
    vekt: 'M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z',
    hjerte: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    valg: 'M4 12l5 5L20 6',
    las: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
    puls: 'M3 12h4l2-5 4 10 2-5h6',
    glass: 'M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M8 21h8',
  }
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p[navn]} />
    </svg>
  )
}

export function Prinsipper({ takt }: SceneProps) {
  useLys(0.12)
  return (
    <div className="scene prinsipper">
      <Inn className="prinsipper-topp">
        <span className="overtittel">Fra innsikt og risiko til designprinsipper</span>
      </Inn>
      <div className="prinsipp-rutenett">
        {PRINSIPPER.map((p, i) => (
          <Inn key={p.tittel} d={0.3 + i * 0.18} className={`prinsipp ${takt >= 1 ? 'apen' : ''}`} style={{ ['--forsinkelse' as string]: `${2 + i * 4.4}s` }}>
            <div className="prinsipp-hode">
              <Ikon navn={p.ikon} />
              <b>{p.tittel}</b>
            </div>
            <motion.div className="prinsipp-detalj" initial={{ opacity: 0, height: 0 }} animate={{ opacity: takt >= 1 ? 1 : 0, height: takt >= 1 ? 'auto' : 0 }} transition={{ duration: 0.9, delay: takt >= 1 ? 0.2 + i * 0.12 : 0, ease: MYK }}>
              <p>
                <small>Fra</small>
                {p.fra}
              </p>
              <p className="i-proto">
                <small>I prototypen</small>
                {p.i}
              </p>
            </motion.div>
          </Inn>
        ))}
      </div>
      <Inn vis={takt >= 1} d={1.4} className="fotnote prinsipp-fotnote">
        Foreløpige designintensjoner – ikke dokumentasjon på at en fremtidig løsning oppfyller alle personvernkrav.
      </Inn>
    </div>
  )
}

/* ══ 11. Sensor tar designvalget ═════════════════════════════════════════════════
   Sensor peker eller sier et tall – presentatøren trykker 1–4. Ingen mobil, ingen QR, ingen nett. */

export const VALG = [
  { tekst: 'Høyest omsetning vinner', svar: 'Terrassen vinner nesten uansett. Stasjonen avgjør – ikke innsatsen.', vi: 'Det vurderte vi – og valgte bort.' },
  { tekst: 'Flest skritt vinner', svar: 'Belønner å slite mer på kroppen – i en jobb som allerede er fysisk krevende.', vi: 'Det valgte vi bort.' },
  { tekst: 'Hver mot sin egen vanlige kveld', svar: 'Like sjanser på tvers av stasjoner. Det er fremgangen som teller.', vi: 'Det var også vårt valg.' },
  { tekst: 'Ingen konkurranse – bare egen oversikt', svar: 'Noen vil ikke konkurrere. Det skal være lov.', vi: 'Det tok vi med som et valg: rolig modus.' },
]

export function Sensor({ takt, valg }: SceneProps) {
  useLys(0.1)
  const valgt = takt >= 2 ? (valg ?? 3) : null
  return (
    <div className="scene sensor">
      <div className="sensor-topp">
        <Inn className="overtittel">Du tar designvalget</Inn>
        <Inn d={0.2} className="sensor-sporsmal stor-serif">
          Hvordan bør kveldens konkurranse avgjøres?
        </Inn>
      </div>

      <motion.div className="stasjoner" animate={{ opacity: valgt ? 0 : 1, y: valgt ? -30 : 0 }} transition={{ duration: 0.8 }}>
        <Inn d={0.5} className="stasjon">
          <span className="stasjon-navn">Jonas</span>
          <b>Terrassen</b>
          <div className="bordprikker">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <small>12 bord</small>
        </Inn>
        <Inn d={0.7} className="stasjon">
          <span className="stasjon-navn">Emma</span>
          <b>Ved vinduene</b>
          <div className="bordprikker">
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <small>7 bord</small>
        </Inn>
        <Inn d={0.9} className="stasjon-merk">
          <span className="merket illustrasjon">Tenkt situasjon · tallene er illustrasjoner</span>
        </Inn>
      </motion.div>

      <div className="valg-liste">
        {VALG.map((v, i) => {
          const nr = i + 1
          const er = valgt === nr
          return (
            <motion.div
              key={nr}
              className={`valg ${er ? 'valgt' : ''} ${takt === 1 ? 'valg-puls' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: valgt ? (er ? 1 : 0.22) : 1, y: 0, scale: er ? 1.04 : 1 }}
              transition={{ duration: 0.8, delay: valgt ? 0 : 1.1 + i * 0.15, ease: MYK }}
            >
              <span className="valg-nr">{nr}</span>
              <b>{v.tekst}</b>
              {er && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.4, duration: 0.7 }}>
                  {v.svar}
                  <em>{v.vi}</em>
                </motion.p>
              )}
            </motion.div>
          )
        })}
      </div>
      <Inn vis={takt === 1} className="sensor-hint">
        Pek, eller si et tall
      </Inn>

      <div className="kjede">
        {[
          { over: 'Innsikt', tekst: 'Ulike stasjoner, gjester og erfaring – og ikke alle vil konkurrere', farge: 'var(--mint)' },
          { over: 'Beslutning', tekst: 'Mål hver mot sitt eget snitt · frivillig deltakelse', farge: 'var(--fersken)' },
          { over: 'I prototypen', tekst: 'Duell i % av egen vanlige kveld · rolig modus', farge: 'var(--rosa)' },
        ].map((k, i) => (
          <Inn key={k.over} vis={takt >= 2} d={1.2 + i * 0.45} className="kjede-ledd">
            <small style={{ color: k.farge }}>{k.over}</small>
            <span>{k.tekst}</span>
          </Inn>
        ))}
      </div>
    </div>
  )
}

