import { sendStatus } from './sync.ts'

// Filmene lastes helt ned når presentasjonen åpnes, så de aldri står og laster midt i fremføringen.
// apning = «Vakten ovenfra» (åpningen), pakket = «Alt vi pakket inn», telefon = prototypen som avsløres,
// hopping = «Frem og tilbake» (innsikt ↔ prototype).

export type FilmNavn = 'apning' | 'pakket' | 'telefon' | 'hopping'
// I den rekkefølgen de trengs
const NAVN: FilmNavn[] = ['apning', 'pakket', 'telefon', 'hopping']
const url = Object.fromEntries(NAVN.map((n) => [n, `film/${n}.mp4`])) as Record<FilmNavn, string>
const klar = Object.fromEntries(NAVN.map((n) => [n, 'laster'])) as Record<FilmNavn, 'laster' | 'klar' | 'feil'>

export const filmUrl = (navn: FilmNavn = 'telefon') => url[navn]

/** Samlet status til presentatørvinduet: klar når alle filmene er lastet. */
export const filmTilstand = (): 'laster' | 'klar' | 'feil' => (NAVN.some((n) => klar[n] === 'feil') ? 'feil' : NAVN.every((n) => klar[n] === 'klar') ? 'klar' : 'laster')

async function last(navn: FilmNavn) {
  const sti = url[navn]
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
  sendStatus({ film: filmTilstand(), demo: '' })
}

export function forhandslastFilm() {
  // Siste bilde fra åpningen ligger bak tittelen – hent det med en gang (de andre ligger bak taletakten etter filmen)
  for (const b of ['apning', 'pakket', 'hopping']) new Image().src = `film/${b}-slutt.png`
  // Én og én, i den rekkefølgen de trengs
  NAVN.reduce((forrige, n) => forrige.then(() => last(n)), Promise.resolve())
}
