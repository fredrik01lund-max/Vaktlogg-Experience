import { sendStatus } from './sync.ts'

// Filmene lastes helt ned når presentasjonen åpnes, så de aldri står og laster midt i fremføringen.
// apning = «Vakten ovenfra» (åpningen), telefon = prototypen som avsløres.

export type FilmNavn = 'apning' | 'telefon'
const NAVN: FilmNavn[] = ['apning', 'telefon']
const url: Record<FilmNavn, string> = { apning: 'film/apning.mp4', telefon: 'film/telefon.mp4' }
const klar: Record<FilmNavn, 'laster' | 'klar' | 'feil'> = { apning: 'laster', telefon: 'laster' }

export const filmUrl = (navn: FilmNavn = 'telefon') => url[navn]

/** Samlet status til presentatørvinduet: klar når begge filmene er lastet. */
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
  // Siste bilde fra åpningen ligger bak tittelen – hent det med en gang
  new Image().src = 'film/apning-slutt.png'
  // Åpningen først – den trengs først
  last('apning').then(() => last('telefon'))
}
