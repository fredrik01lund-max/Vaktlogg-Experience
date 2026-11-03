import { motion } from 'motion/react'
import { oppsett, navn } from '../lib/oppsett.ts'
import { Bong, Merke } from '../ui/Deler.tsx'
import { Foto } from '../ui/Foto.tsx'
import { foto } from '../lib/foto.ts'
import { FILM, Inn, MYK, useLys, type SceneProps } from './felles.tsx'

/* ══ 13. Testing og iterasjon ═══════════════════════════════════════════════════ */

const MILEPAELER = [
  { dato: 'Før 22.10', tekst: 'Tidlig prototype vist til servitører' },
  { dato: '22.10', tekst: 'Første digitale versjon' },
  { dato: '27.10', tekst: 'På nett via lenke – kan installeres som app' },
  { dato: '28.–29.10', tekst: 'Personalmeny, belønninger og guiden Sir Domeo' },
  { dato: '30.10', tekst: 'Tilbakemelding rett fra appen' },
]

export function Testing({ takt }: SceneProps) {
  useLys(0.1)
  const funn = oppsett.innsikt.testfunn
  return (
    <div className="scene testing">
      <motion.div className="test-hvem" animate={{ opacity: takt === 0 ? 1 : 0, y: takt === 0 ? 0 : -40 }} transition={{ duration: 0.9, ease: MYK }}>
        <Inn className="overtittel">Test · hvem har prøvd</Inn>
        <Inn d={0.2} className="test-steder-tekst">
          Personer med tilknytning til blant annet
        </Inn>
        <div className="test-steder">
          {oppsett.innsikt.testmiljoer.map((s, i) => (
            <Inn key={s} d={0.4 + i * 0.15} className="test-sted stor-serif">
              {s}
            </Inn>
          ))}
        </div>
        <div className="test-kolonner">
          <Inn d={1.3} className="test-kolonne">
            <span className="merket observert">Gjennomført</span>
            <ul>
              <li>Demonstrasjoner for restaurantansatte</li>
              <li>Egen utforsking via lenke – uten oss til stede</li>
              <li>Muntlige og skriftlige tilbakemeldinger</li>
            </ul>
          </Inn>
          <Inn d={1.6} className="test-kolonne">
            <span className="merket illustrasjon">Utarbeidet</span>
            <ul>
              <li>Strukturert testopplegg med hypoteser og observasjonspunkter</li>
              <li>Hva legger de merke til først? Hva forstår de ikke? Hva overser de? Hva vil de endre?</li>
            </ul>
          </Inn>
          {funn.length > 0 && (
            <Inn d={1.9} className="test-kolonne">
              <span className="merket">Dokumenterte funn</span>
              <ul>
                {funn.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Inn>
          )}
        </div>
      </motion.div>

      <div className="iterasjon">
        <Inn vis={takt === 1} className="overtittel">
          Iterasjon · hver versjon kom av noe vi lærte
        </Inn>
        <svg className="iterasjon-linje" viewBox="0 0 1600 260" aria-hidden="true">
          <motion.path d="M60 150H1540" stroke="var(--linje-2)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: takt === 1 ? 1 : 0 }} transition={{ duration: 1.8, ease: FILM }} />
          {[0, 1, 2, 3].map((i) => {
            const x1 = 60 + (i + 1) * 370
            const x0 = 60 + i * 370
            return (
              <motion.path
                key={i}
                d={`M${x1 - 40} 130 C ${x1 - 100} 30, ${x0 + 100} 30, ${x0 + 40} 130`}
                fill="none"
                stroke="url(#iterG)"
                strokeWidth="2.5"
                strokeDasharray="5 7"
                markerEnd="url(#pil)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: takt === 1 ? 1 : 0, opacity: takt === 1 ? 1 : 0 }}
                transition={{ duration: 1.1, delay: 1.2 + i * 0.6, ease: MYK }}
              />
            )
          })}
          <defs>
            <linearGradient id="iterG" x1="0" x2="1">
              <stop offset="0" stopColor="#F08FB0" />
              <stop offset="1" stopColor="#F5B46E" />
            </linearGradient>
            <marker id="pil" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#F08FB0" />
            </marker>
          </defs>
        </svg>
        <div className="milepaeler">
          {MILEPAELER.map((m, i) => (
            <Inn key={m.dato} vis={takt === 1} d={0.4 + i * 0.3} className="milepael">
              <i />
              <small>{m.dato}</small>
              <span>{m.tekst}</span>
            </Inn>
          ))}
        </div>
        <Inn vis={takt === 1} d={2.8} className="iterasjon-tilbake">
          Tilbakemeldinger <span>↺</span> justeringer – mellom hver versjon
        </Inn>
      </div>

      <div className="omfang">
        <Inn vis={takt === 2} className="overtittel">
          Brukerdrevet – men avgrenset
        </Inn>
        <svg className="omfang-svg" viewBox="0 0 900 600" aria-hidden="true">
          <motion.circle cx="380" cy="300" r="230" fill="rgba(249,202,219,0.35)" stroke="#F08FB0" strokeWidth="2" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: takt === 2 ? 1 : 0.7, opacity: takt === 2 ? 1 : 0 }} transition={{ duration: 1.2, ease: MYK }} style={{ transformOrigin: '380px 300px' }} />
          <motion.circle cx="640" cy="170" r="110" fill="rgba(191,233,211,0.45)" stroke="#7CC9A1" strokeWidth="2" strokeDasharray="6 6" initial={{ x: 200, opacity: 0 }} animate={{ x: takt === 2 ? 0 : 200, opacity: takt === 2 ? 1 : 0 }} transition={{ duration: 1.4, delay: 0.8, ease: MYK }} />
        </svg>
        <Inn vis={takt === 2} d={0.5} className="omfang-kjerne">
          <small>Kjernen</small>
          <b className="stor-serif">Motivasjon og anerkjennelse</b>
        </Inn>
        <Inn vis={takt === 2} d={1.2} className="omfang-gjester">
          <small>Ønske fra testere</small>
          <b>Oversikt over egne gjester og bord</b>
        </Inn>
        <div className="omfang-tekst">
          <Inn vis={takt === 2} d={1.8}>
            <p>
              Flere servitører ønsket bedre oversikt over egne gjester, bord og allergier på mobilen. Vi utforsket det i prototypen.
            </p>
          </Inn>
          <Inn vis={takt === 2} d={2.3}>
            <p className="omfang-poeng">Men ikke alle ønsker passer formålet. Innsikt brukes også til å prioritere og avgrense.</p>
          </Inn>
        </div>
      </div>
    </div>
  )
}

/* ══ 14. NABC ══════════════════════════════════════════════════════════════════ */

const NABC = [
  { bokstav: 'N', navn: 'Need', tekst: 'Interesse for egen aktivitet, egne salgstall og anerkjennelse – og et rom etter vakten der innsatsen forsvinner.' },
  { bokstav: 'A', navn: 'Approach', tekst: 'Aktivitet, salg, personlig progresjon, frivillige konkurranser og anerkjennelse i én mobil tjeneste.' },
  { bokstav: 'B', navn: 'Benefits', tekst: 'Bedre oversikt, mer synlig anerkjennelse og mestring. For restauranten: et verktøy for medarbeiderengasjement.', merk: 'Hypoteser – må undersøkes' },
  { bokstav: 'C', navn: 'Competition', tekst: 'Aktivitetsapper, kassasystemer og manuelle konkurranser. Mulig fortrinn: en samlet opplevelse laget for restaurantansatte.', merk: 'Ikke dokumentert at Vaktlogg er bedre' },
]

export function Nabc({ takt }: SceneProps) {
  useLys(0.15)
  return (
    <div className="scene nabc">
      <div className="nabc-rad">
        {NABC.map((n, i) => (
          <motion.div key={n.bokstav} className={`nabc-kol ${i === takt ? 'na' : ''}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: i <= takt ? (i === takt ? 1 : 0.5) : 0.12, y: 0 }} transition={{ duration: 1, delay: i === 0 && takt === 0 ? 0.2 : 0, ease: MYK }}>
            <span className="nabc-bokstav stor-serif">{n.bokstav}</span>
            <small className="overtittel">{n.navn}</small>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: i <= takt ? 1 : 0 }} transition={{ duration: 0.8, delay: i === takt ? 0.3 : 0 }}>
              {n.tekst}
            </motion.p>
            {n.merk && i <= takt && <span className="merket illustrasjon">{n.merk}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ══ 15. Hva vi vet – og ikke vet ═══════════════════════════════════════════════ */

const KOLONNER = [
  { over: 'Det vi har hørt og sett', farge: 'var(--mint)', linjer: ['Sett i observasjoner: ansatte sjekket kassarapporten etter vakten', 'Hørt i intervjuer: interesse for skritt – og for egne salgstall', 'Anerkjennelse og kolleger gikk igjen i deler av materialet'] },
  { over: 'Det vi tror', farge: 'var(--gull)', linjer: ['Synlig innsats og anerkjennelse kan øke motivasjonen', 'Konkurranser kan motivere noen – ikke nødvendigvis alle'] },
  { over: 'Det vi må teste', farge: 'var(--rosa)', linjer: ['Åpner ansatte appen etter vakten – med sine egne data?', 'Opplever de faktisk mer motivasjon over tid?'] },
]
const SVAKHETER = ['Noen ledende spørsmål', 'Egen bransjeerfaring kan farge tolkningen', 'Mest folk som fortsatt er i bransjen', 'Konkurranse-eksemplet: én informant', 'Skritt: selvrapportert, ikke målt', 'Positive svar kan være høflighet', 'Simulerte data i prototypen', 'Personvern og rettslig grunnlag ikke avklart', 'Ingen ekte integrasjoner ennå']

export function Refleksjon({ takt }: SceneProps) {
  useLys(0.08)
  return (
    <div className="scene refleksjon">
      <div className="vet-kolonner">
        {KOLONNER.map((k, i) => (
          <Inn key={k.over} d={0.2 + i * 0.5} className="vet-kol">
            <span className="vet-over" style={{ color: k.farge }}>
              {k.over}
            </span>
            {k.linjer.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </Inn>
        ))}
      </div>
      <div className="svakheter">
        <Inn vis={takt >= 1} className="overtittel">
          Begrensninger i arbeidet
        </Inn>
        <div className="svakhet-rad">
          {SVAKHETER.map((s, i) => (
            <Inn key={s} vis={takt >= 1} d={0.3 + i * 0.16} className="merket" y={14}>
              {s}
            </Inn>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══ 16. Videre ═══════════════════════════════════════════════════════════════ */

const SPORSMAL = [
  ['Motivasjon', 'Opplever ansatte faktisk økt motivasjon?'],
  ['Brukeratferd', 'Åpner de appen etter vakten – med egne data?'],
  ['Prioritering', 'Hvilke funksjoner betyr mest? (vi har vurdert en stemmefunksjon i prototypen)'],
  ['Rettferdighet', 'Hvordan blir konkurranser rettferdige på tvers av vakter og stasjoner?'],
  ['Personvern', 'Et verktøy for ansatte – ikke et kontrollsystem for arbeidsgiver?'],
  ['Forretningsmodell', 'Hvem betaler – og hvordan holder vi de ansattes behov først?'],
  ['Integrasjon', 'Får vi salgsdata gjennom samarbeid med kassasystemleverandører?'],
]

export function Videre({ takt }: SceneProps) {
  useLys(0.15)
  return (
    <div className="scene videre">
      <div className="videre-liste">
        <Inn className="overtittel">Videre · bedre svar før flere funksjoner</Inn>
        {SPORSMAL.map(([t, s], i) => (
          <Inn key={t} d={0.4 + i * 0.32} x={-30} y={0} className="videre-sp">
            <small>{t}</small>
            <span>{s}</span>
          </Inn>
        ))}
      </div>
      <motion.div className="pilot" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: takt >= 1 ? 1 : 0, scale: takt >= 1 ? 1 : 0.6 }} transition={{ duration: 1.3, ease: MYK }}>
        <span className="merket illustrasjon">Mulig neste steg</span>
        <b className="stor-serif">Pilot</b>
        <p>En begrenset pilot med én restaurant eller restaurantgruppe – med ekte data og over tid.</p>
      </motion.div>
    </div>
  )
}

/* ══ 17. Avslutning ═════════════════════════════════════════════════════════════ */

export function Slutt({ takt }: SceneProps) {
  useLys(takt >= 3 ? 0.8 : 0.45)
  const harFoto = foto('slutt').status === 'ok'
  return (
    <div className="scene slutt">
      {harFoto && (
        <motion.div className="slutt-foto" initial={{ opacity: 0 }} animate={{ opacity: takt >= 3 ? 0.35 : 0.18 }} transition={{ duration: 2 }}>
          <Foto id="slutt" kamera="ut" tid={30} />
        </motion.div>
      )}
      <motion.div className="skinne slutt-skinne" initial={{ scaleX: 0 }} animate={{ scaleX: takt < 3 ? 1 : 0, opacity: takt < 3 ? 1 : 0 }} transition={{ duration: 1.4, ease: FILM }} />
      <motion.div className="slutt-bong" initial={{ y: -520, opacity: 0 }} animate={{ y: takt === 2 ? 0 : -520, opacity: takt === 2 ? 1 : 0 }} transition={{ duration: 2.6, ease: [0.3, 0, 0.2, 1], delay: takt === 2 ? 1 : 0 }}>
        <Bong b={{ bord: 'VAKT FERDIG', tid: '23:30', linjer: ['SKRITT ............ ✓', 'SALG .............. ✓', 'KUDOS ............. ✓', 'TAKKEKORT ......... ✓'], merk: 'DU BLE SETT' }} className="stor" />
      </motion.div>

      <div className="slutt-linjer">
        <Inn vis={takt <= 2} className="slutt-linje stor-serif">
          Vi startet med å undersøke fravær.
        </Inn>
        <Inn vis={takt >= 1 && takt <= 2} d={0.3} className="slutt-linje liten">
          Gjennom innsikt og brukermedvirkning endte vi med å utforske hvordan servitører kan oppleve mer motivasjon og anerkjennelse i arbeidshverdagen.
        </Inn>
        <Inn vis={takt === 2} d={3.2} className="slutt-linje kursiv stor-serif">
          Vaktlogg er konseptet som vokste frem gjennom denne prosessen.
        </Inn>
      </div>

      <div className="sluttkort">
        <Inn vis={takt >= 3} d={0.4}>
          <Merke storrelse={128} />
        </Inn>
        <Inn vis={takt >= 3} d={0.7} className="tittel-vaktlogg">
          VAKTLOGG
        </Inn>
        <Inn vis={takt >= 3} d={0.9} className="tittel-bak stor-serif">
          Behind the shift
        </Inn>
        <Inn vis={takt >= 3} d={1.3} className="tittel-navn">
          {navn('A')} <i>·</i> {navn('B')} <i>·</i> {navn('C')}
        </Inn>
        <Inn vis={takt >= 3} d={1.6} className="slutt-url">
          {oppsett.prototypeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </Inn>
        <Inn vis={takt >= 3} d={2} className="slutt-takk stor-serif">
          Takk.
        </Inn>
      </div>
    </div>
  )
}
