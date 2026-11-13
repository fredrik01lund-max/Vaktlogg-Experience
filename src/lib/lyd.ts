// Én felles lydspiller for Sir Domeos stemme og «Test lyd».
// iPhone og iPad spiller bare lyd fra et lydelement som er startet av et trykk. Derfor brukes det samme elementet
// hele tiden, og det «låses opp» stille ved første trykk på skjermen (lasOppLyd). Etter det kan stemmen spilles
// av også når den startes av prototypen (postMessage) og ikke av et trykk.

let el: HTMLAudioElement | null = null
const spiller = () => (el ??= new Audio())

/** Spiller av en lydfil (stopper det som spilles fra før). */
export function spillLyd(src: string): HTMLAudioElement {
  const a = spiller()
  a.pause()
  a.muted = false
  a.src = src
  a.currentTime = 0
  a.play().catch(() => {
    /* ikke låst opp ennå – teksten og bildet står uansett */
  })
  return a
}

let opplast = false
/** Kalles i et trykk: starter og stopper lydelementet uten lyd, så iOS lar det spille senere. */
export function lasOppLyd() {
  if (opplast) return
  opplast = true
  const a = spiller()
  if (!a.paused) return
  a.muted = true
  a.src = 'demo/domeo/lydtest.mp3'
  a.play()
    .then(() => {
      a.pause()
      a.currentTime = 0
      a.muted = false
    })
    .catch(() => {
      a.muted = false
      opplast = false
    })
}
