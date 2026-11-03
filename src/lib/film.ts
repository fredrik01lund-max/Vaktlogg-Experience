import { sendStatus } from './sync.ts'

// Filmen lastes helt ned når presentasjonen åpnes, så den aldri står og laster midt i fremføringen.

const STI = 'film/telefon.mp4'
let url = STI
let tilstand: 'laster' | 'klar' | 'feil' = 'laster'

export const filmUrl = () => url
export const filmTilstand = () => tilstand

export async function forhandslastFilm() {
  try {
    // Fra fil (dobbeltklikk) kan nettleseren ikke hente med fetch – gå rett til videoelementet
    if (location.protocol === 'file:') throw new Error('fil')
    const svar = await fetch(STI)
    if (!svar.ok) throw new Error(String(svar.status))
    url = URL.createObjectURL(await svar.blob())
    tilstand = 'klar'
  } catch {
    // Da laster videoelementet filmen selv
    const v = document.createElement('video')
    v.preload = 'auto'
    v.muted = true
    v.src = STI
    v.oncanplaythrough = () => {
      tilstand = 'klar'
      sendStatus({ film: tilstand, demo: '' })
    }
    v.onerror = () => {
      tilstand = 'feil'
      sendStatus({ film: tilstand, demo: '' })
    }
    v.load()
    return
  }
  sendStatus({ film: tilstand, demo: '' })
}
