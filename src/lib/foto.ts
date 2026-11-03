// Fotosystemet: leser public/foto/foto.js (window.VAKTLOGG_FOTO) og avgjør hva som kan vises.
// Den offentlige nettsiden viser bare bilder med samtykke.offentlig. Eksamensversjonen og
// utviklingsserveren (lokal øving) viser bilder med samtykke.eksamen.

export type Behandling = { metning: number; kontrast: number; lysstyrke: number; varme: number; korn: number }

export type FotoPlass = {
  fil?: string
  fokus?: [number, number]
  tekst?: string
  kreditering?: string
  samtykke?: { eksamen?: boolean; offentlig?: boolean }
  identifiserbar?: boolean
  kanKnyttesTilSitat?: boolean
  lag?: { fil: string; dybde: number }[]
  justering?: Partial<Behandling>
  punkter?: Record<string, [number, number]>
  beskrivelse?: string
}

type FotoOppsett = { behandling?: Partial<Behandling>; plasser?: Record<string, FotoPlass> }

declare global {
  interface Window {
    VAKTLOGG_FOTO?: FotoOppsett
  }
}

/** Lokal fremføring/øving: eksamensklarerte bilder kan vises. */
export const EKSAMEN = __EKSAMEN__ || import.meta.env.DEV

const kilde: FotoOppsett = (typeof window !== 'undefined' && window.VAKTLOGG_FOTO) || {}

export const behandling: Behandling = { metning: 0.78, kontrast: 1.08, lysstyrke: 0.96, varme: 0.12, korn: 0.06, ...kilde.behandling }

export type FotoStatus = 'ok' | 'mangler' | 'ikke-klarert'

export type Foto = {
  id: string
  plass: FotoPlass
  url: string | null
  lag: { url: string; dybde: number }[]
  status: FotoStatus
  fokus: [number, number]
}

const sti = (fil: string) => `foto/${fil.split('/').map(encodeURIComponent).join('/')}`

export function foto(id: string): Foto {
  const plass = kilde.plasser?.[id] ?? {}
  const fokus: [number, number] = Array.isArray(plass.fokus) && plass.fokus.length === 2 ? [clamp(plass.fokus[0]), clamp(plass.fokus[1])] : [0.5, 0.5]
  const fil = (plass.fil ?? '').trim()
  if (!fil) return { id, plass, url: null, lag: [], status: 'mangler', fokus }
  const klarert = EKSAMEN ? !!(plass.samtykke?.eksamen || plass.samtykke?.offentlig) : !!plass.samtykke?.offentlig
  if (!klarert) return { id, plass, url: null, lag: [], status: 'ikke-klarert', fokus }
  const lag = (plass.lag ?? []).filter((l) => l && typeof l.fil === 'string' && l.fil.trim()).map((l) => ({ url: sti(l.fil.trim()), dybde: Number(l.dybde) || 0 }))
  return { id, plass, url: sti(fil), lag, status: 'ok', fokus }
}

export function allePlasser(): string[] {
  return Object.keys(kilde.plasser ?? {})
}

/** CSS-filteret som gir alle bildene samme uttrykk. */
export function fargefilter(j?: Partial<Behandling>): string {
  const b = { ...behandling, ...j }
  return `saturate(${b.metning}) contrast(${b.kontrast}) brightness(${b.lysstyrke}) sepia(${b.varme})`
}

/** Last alle bildene i forkant, så ingenting dukker opp halvveis i en overgang. */
export function forhandslast() {
  for (const id of allePlasser()) {
    const f = foto(id)
    for (const u of [f.url, ...f.lag.map((l) => l.url)]) if (u) new Image().src = u
  }
}

function clamp(n: number) {
  return Math.min(1, Math.max(0, Number(n) || 0))
}
