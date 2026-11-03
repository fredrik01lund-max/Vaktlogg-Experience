// Sjekker tidsplanen: npm run sjekk
// Summen av scenene skal bli 12:00, og de tre presentatørene skal ha omtrent like mye taletid.
import { manus, PLAN_TOTAL } from '../src/content/manus.ts'
import { kilder } from '../src/content/kilder.ts'
import { fordeling, manusTid, mmss, sceneStart, taktPlan, taletid } from '../src/content/tid.ts'

let feil = 0
const total = manus.reduce((a, s) => a + s.varighet, 0)
console.log(`Total plan: ${mmss(total)} (mål ${mmss(PLAN_TOTAL)})`)
if (total !== PLAN_TOTAL) {
  console.log(`  ✗ Summen er ${total} s, ikke ${PLAN_TOTAL} s`)
  feil++
}

const starter = sceneStart(manus)
console.log('\nScene                          Start   Plan   Manus (beregnet tale)')
for (const [i, s] of manus.entries()) {
  const tale = s.takter.reduce((a, t) => a + taletid(t.sier), 0)
  const stille = taktPlan(s).reduce((a, sek, j) => a + (s.takter[j].hvem === 'stille' || s.takter[j].hvem === 'sensor' ? sek : 0), 0)
  const trangt = tale + stille > s.varighet + 3
  console.log(`${s.tittel.padEnd(30)} ${mmss(starter[i]).padStart(5)}  ${String(s.varighet).padStart(4)} s  ${Math.round(tale + stille)} s${trangt ? '  ← manuset er lengre enn planen' : ''}`)
  for (const k of s.kilder) if (!kilder[k]) {
    console.log(`  ✗ Ukjent kilde «${k}»`)
    feil++
  }
}

const f = fordeling(manus)
const m = manusTid(manus)
console.log('\nTid per presentatør (plan / beregnet fra manus)')
for (const p of ['A', 'B', 'C'] as const) console.log(`  ${p}: ${mmss(f[p])} / ${mmss(m[p])}`)
console.log(`  Stille sekvenser: ${mmss(f.stille)}   Sensor: ${mmss(f.sensor)}`)
const snitt = (f.A + f.B + f.C) / 3
for (const p of ['A', 'B', 'C'] as const) {
  if (Math.abs(f[p] - snitt) / snitt > 0.12) {
    console.log(`  ✗ ${p} avviker mer enn 12 % fra snittet`)
    feil++
  }
}
if (f.sensor + 0 > 30) {
  console.log('  ✗ Sensordelen er over 30 s')
  feil++
}
console.log(feil ? `\n${feil} feil` : '\nAlt stemmer.')
process.exit(feil ? 1 : 0)
