// Sjekker tidsplanen: npm run sjekk
// Summen av scenene skal holde seg på målet (cirka 10:00) og godt under den harde grensen (12:00).
// De tre presentatørene skal ha omtrent like mye å si – målt både i planlagt tid og i faktiske ord.
import { manus, MAKS_TOTAL, PLAN_TOTAL } from '../src/content/manus.ts'
import { lagtTilSide } from '../src/content/arkiv.ts'
import { kilder } from '../src/content/kilder.ts'
import { fordeling, manusTid, mmss, ord, sceneStart, taktPlan, taletid } from '../src/content/tid.ts'

let feil = 0
const total = manus.reduce((a, s) => a + s.varighet, 0)
console.log(`Total plan: ${mmss(total)} (mål høyst ${mmss(PLAN_TOTAL)}, hard grense ${mmss(MAKS_TOTAL)})`)
if (total > PLAN_TOTAL) {
  console.log(`  ✗ Summen er ${total} s – over målet på ${PLAN_TOTAL} s`)
  feil++
}
console.log(`  Margin til målet: ${mmss(PLAN_TOTAL - total)} · til den harde grensen: ${mmss(MAKS_TOTAL - total)}`)

const starter = sceneStart(manus)
console.log('\nScene                          Start   Plan   Manus (beregnet tale + stille)')
for (const [i, s] of manus.entries()) {
  const tale = s.takter.reduce((a, t) => a + taletid(t.sier), 0)
  const stille = taktPlan(s).reduce((a, sek, j) => a + (s.takter[j].hvem === 'stille' || s.takter[j].hvem === 'sensor' ? sek : 0), 0)
  const trangt = tale + stille > s.varighet
  console.log(`${s.tittel.padEnd(30)} ${mmss(starter[i]).padStart(5)}  ${String(s.varighet).padStart(4)} s  ${Math.round(tale + stille)} s${trangt ? '  ← manuset er lengre enn planen' : ''}`)
  if (trangt) feil++
  for (const k of s.kilder) if (!kilder[k]) {
    console.log(`  ✗ Ukjent kilde «${k}»`)
    feil++
  }
}

const f = fordeling(manus)
const m = manusTid(manus)
const ordPer = { A: 0, B: 0, C: 0 }
for (const s of manus) for (const t of s.takter) if (t.hvem === 'A' || t.hvem === 'B' || t.hvem === 'C') ordPer[t.hvem] += ord(t.sier)
console.log('\nPer presentatør (plan / beregnet tale / ord)')
for (const p of ['A', 'B', 'C'] as const) console.log(`  ${p}: ${mmss(f[p])} / ${mmss(m[p])} / ${ordPer[p]} ord`)
console.log(`  Stille sekvenser: ${mmss(f.stille)}   Sensor: ${mmss(f.sensor)}`)
const balanse = (verdi: Record<'A' | 'B' | 'C', number>, hva: string) => {
  const snitt = (verdi.A + verdi.B + verdi.C) / 3
  for (const p of ['A', 'B', 'C'] as const) {
    if (Math.abs(verdi[p] - snitt) / snitt > 0.12) {
      console.log(`  ✗ ${p} avviker mer enn 12 % fra snittet (${hva})`)
      feil++
    }
  }
}
balanse(f, 'planlagt tid')
balanse(ordPer, 'antall ord')
// Sensor prøver prototypen selv i demoen (Sir Domeo guider) – det skal få god tid, men ikke ta over
if (f.sensor < 120 || f.sensor > 150) {
  console.log('  ✗ Sensordelen skal være mellom 2:00 og 2:30')
  feil++
}
for (const s of lagtTilSide) for (const k of s.kilder) if (!kilder[k]) {
  console.log(`  ✗ Ukjent kilde «${k}» i ${s.id} (lagt til side)`)
  feil++
}
console.log(`\nLagt til side (ikke i flyten): ${lagtTilSide.map((s) => s.tittel).join(' · ')}`)
console.log(feil ? `\n${feil} feil` : '\nAlt stemmer.')
process.exit(feil ? 1 : 0)
