import type { Hvem } from '../content/types.ts'

// Leser public/oppsett.js (window.VAKTLOGG_OPPSETT). Mangler noe, brukes standardverdiene.

export type Oppsett = {
  presentatorer: Record<Hvem, { navn: string; rolle: string }>
  innsikt: {
    transkriberteIntervjuer: number | null
    observasjonssteder: string[]
    testmiljoer: string[]
    testfunn: string[]
  }
  lyd: { apning: string; volum: number }
  prototypeUrl: string
}

declare global {
  interface Window {
    VAKTLOGG_OPPSETT?: Partial<Oppsett>
  }
}

const standard: Oppsett = {
  presentatorer: {
    A: { navn: 'Presentatør A', rolle: 'Problem og innsikt' },
    B: { navn: 'Presentatør B', rolle: 'Design Thinking og konseptutvikling' },
    C: { navn: 'Presentatør C', rolle: 'Prototype, testing og refleksjon' },
  },
  innsikt: { transkriberteIntervjuer: null, observasjonssteder: ['Noode Sky', 'Park 29'], testmiljoer: ['Noode Sky', 'Park 29', 'Frenchie', 'Olivia', 'The Thief'], testfunn: [] },
  lyd: { apning: '', volum: 0.35 },
  prototypeUrl: 'https://fredrik01lund-max.github.io/Vaktlogg/',
}

const fra = (typeof window !== 'undefined' && window.VAKTLOGG_OPPSETT) || {}

export const oppsett: Oppsett = {
  presentatorer: {
    A: { ...standard.presentatorer.A, ...fra.presentatorer?.A },
    B: { ...standard.presentatorer.B, ...fra.presentatorer?.B },
    C: { ...standard.presentatorer.C, ...fra.presentatorer?.C },
  },
  innsikt: { ...standard.innsikt, ...fra.innsikt, testfunn: (fra.innsikt?.testfunn ?? []).filter((t) => typeof t === 'string' && t.trim()) },
  lyd: { ...standard.lyd, ...fra.lyd },
  prototypeUrl: fra.prototypeUrl || standard.prototypeUrl,
}

export const navn = (h: Hvem) => oppsett.presentatorer[h].navn

/** Navnene er fortsatt plassholdere («Presentatør A»)? */
export const navnMangler = (['A', 'B', 'C'] as const).some((h) => /^Presentatør [ABC]$/.test(navn(h)))

/** Bytter {A} {B} {C} i manus med navnene. */
export function medNavn(tekst: string): string {
  return tekst.replace(/\{([ABC])\}/g, (_, h: Hvem) => navn(h))
}

// Prototypens sterke pastelltoner: synlige både på lys og mørk bakgrunn
export const FARGE: Record<Hvem, string> = { A: '#F5B46E', B: '#7CC9A1', C: '#F08FB0' }
