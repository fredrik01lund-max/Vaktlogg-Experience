export type Hvem = 'A' | 'B' | 'C'
/** Hvem «har ordet» i en takt: en presentatør, ingen (stille sekvens), sensor eller alle tre. */
export type Ordet = Hvem | 'stille' | 'sensor' | 'alle'

export type Fase = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test'

/** Én takt = ett klikk. Scenen viser ulike ting for hver takt. */
export type Takt = {
  hvem: Ordet
  /** Det presentatøren sier (manus). {A} {B} {C} byttes med navnene fra oppsett.js. */
  sier?: string
  /** Regi: hva som skjer på skjermen, hva man trykker på, når man skal vente. */
  regi?: string
  /** Sekunder animasjon som spilles når takten starter – presentatørvisningen teller ned og sier «vent». */
  anim?: number
  /** Gå automatisk videre etter så mange sekunder (bare stille sekvenser). */
  auto?: number
}

export type Scene = {
  id: string
  tittel: string
  /** Del av fortellingen (vises i presentatørvisningen og manuset). */
  del: 'Åpning' | 'Problem og innsikt' | 'Design Thinking og konsept' | 'Prototype og testing' | 'Refleksjon og videre' | 'Avslutning'
  fase?: Fase
  /** Fargetema: lyst (prototypens, standard) eller mørkt (åpningen – natten). */
  tema?: 'lys' | 'mork'
  /** Planlagt varighet i sekunder. Summen skal bli 720 (12 minutter). */
  varighet: number
  takter: Takt[]
  /** Hvordan overgangen til neste scene skal gjøres. */
  overgang: string
  /** Nøkler i kilder.ts som støtter påstandene i scenen. */
  kilder: string[]
}
