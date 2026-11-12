import { manus } from '../content/manus.ts'
import { forhandslastIkon } from '../ui/Diamant.tsx'
import { sendStatus } from './sync.ts'

// Filmene lastes helt ned når presentasjonen åpnes, så de aldri står og laster midt i fremføringen.
// Bare filmene flyten i manus.ts bruker, lastes på forhånd (i den rekkefølgen de trengs). Filmene til scenene
// som er lagt til side (apning, pakket, hopping), hentes først når de vises.

export type FilmNavn = string

// Hvilken fil hver film bruker. Nye versjoner av Blender-filmene får eget filnavn (de gamle ligger urørt), så
// å gå tilbake til en gammel film er å ta bort linjen her.
const FIL: Record<string, string> = {
  intervju: 'intervju2',
  kilder: 'kilder2',
  kassa: 'kassa2',
  apning: 'apning2',
  reise: 'reise2',
  hopping: 'hopping2',
  kassafunn: 'kassa3', // 12.11: funn 2 – kameraet glir inn på søppelbøtta mens lappene kastes (brukerreisen bruker kassa2)
  telefon: 'telefon2', // 12.11: uten vaktlista på brettet, og med Sir Domeos nye første replikk på skjermen
}
const filSti = (navn: FilmNavn) => `film/${FIL[navn] ?? navn}.mp4`

function brukteFilmer(): FilmNavn[] {
  const navn: FilmNavn[] = []
  for (const s of manus) {
    if (s.id === 'funn') navn.push('apning', 'kassafunn', 'intervju')
    if (s.id === 'reise') navn.push('reise', 'kassa')
    if (s.id === 'ideate') navn.push('kilder')
    if (s.id === 'demo') navn.push('telefon')
    if (s.id === 'test') navn.push('hopping')
  }
  return [...new Set(navn)]
}
const NAVN = brukteFilmer()
const url: Record<string, string> = Object.fromEntries(NAVN.map((n) => [n, filSti(n)]))
const klar: Record<string, 'laster' | 'klar' | 'feil'> = Object.fromEntries(NAVN.map((n) => [n, 'laster']))

export const filmUrl = (navn: FilmNavn = 'telefon') => url[navn] ?? filSti(navn)

/** Samlet status til presentatørvinduet: klar når alle filmene er lastet. */
export const filmTilstand = (): 'laster' | 'klar' | 'feil' => (NAVN.some((n) => klar[n] === 'feil') ? 'feil' : NAVN.every((n) => klar[n] === 'klar') ? 'klar' : 'laster')

/** Filmene som mangler eller ikke kunne lastes. */
export const filmerSomMangler = () => NAVN.filter((n) => klar[n] === 'feil')

async function last(navn: FilmNavn) {
  const sti = filSti(navn)
  try {
    // Fra fil (dobbeltklikk) kan nettleseren ikke hente med fetch – gå rett til videoelementet
    if (location.protocol === 'file:') throw new Error('fil')
    const svar = await fetch(sti)
    if (!svar.ok) throw new Error(String(svar.status))
    url[navn] = URL.createObjectURL(await svar.blob())
    klar[navn] = 'klar'
  } catch {
    // Da laster videoelementet filmen selv
    await new Promise<void>((ferdig) => {
      const v = document.createElement('video')
      v.preload = 'auto'
      v.muted = true
      v.src = sti
      v.oncanplaythrough = () => {
        klar[navn] = 'klar'
        ferdig()
      }
      v.onerror = () => {
        klar[navn] = 'feil'
        ferdig()
      }
      v.load()
    })
  }
  sendStatus({ film: filmTilstand() })
}

export function forhandslastFilm() {
  // Diamant-ikonet: stillbildene og de korte animasjonene
  forhandslastIkon()
  // Én og én, i den rekkefølgen de trengs
  NAVN.reduce((forrige, n) => forrige.then(() => last(n)), Promise.resolve())
}
