import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/base.css'
import './styles/scener.css'
import './styles/visninger.css'
import { forhandslastFilm } from './lib/film.ts'
import { forhandslast } from './lib/foto.ts'
import { Salen } from './stage/Salen.tsx'
import { Presentator } from './views/Presentator.tsx'
import { Manus } from './views/Manus.tsx'
import { FotoOversikt } from './views/FotoOversikt.tsx'

// ?vis=presentator · ?vis=manus · ?vis=foto – ellers hovedskjermen
const vis = new URLSearchParams(window.location.search).get('vis')

if (!vis) {
  forhandslastFilm()
  forhandslast()
}
document.body.classList.add(`vis-${vis || 'hoved'}`)
if (vis === 'presentator') document.title = 'Presentatør · VAKTLOGG EXPERIENCE'
if (vis === 'manus') document.title = 'Manus · VAKTLOGG EXPERIENCE'

createRoot(document.getElementById('root')!).render(
  <StrictMode>{vis === 'presentator' ? <Presentator /> : vis === 'manus' ? <Manus /> : vis === 'foto' ? <FotoOversikt /> : <Salen />}</StrictMode>,
)
