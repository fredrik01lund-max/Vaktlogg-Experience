import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Offline-filen: ÉN html-fil med alt innebygd (kode, fonter, filmer, bilder, lyd, spillet og prototypen), som
// åpnes med dobbeltklikk uten nett. Denne konfigurasjonen bygger bare koden til dist-offline/index.html;
// scripts/pakk-offline.mjs legger filene fra public/ inn i den og skriver den ferdige filen.
//   npm run build:offline

/** Filen gis til andre (sensor): arbeidsnotatene våre skal ikke ligge i den. Regi og overganger tømmes,
 *  kildenotatene, scenene som er lagt til side, manusvisningen og fotooversikten tas ut, og nettadressene med
 *  brukernavn fjernes. Replikkene (sier) blir stående, så presentatørvisningen fortsatt kan brukes. */
const tomme = (...navn: string[]) => navn.map((n) => `export const ${n} = () => null`).join('\n')

function utenArbeidsnotater(): Plugin {
  const TOMME: [RegExp, string][] = [
    [/[\\/]content[\\/]arkiv\.ts$/, 'export const lagtTilSide = []'],
    [/[\\/]content[\\/]kilder\.ts$/, 'export const kilder = {}'],
    [/[\\/]views[\\/]Manus\.tsx$/, 'export const Manus = () => null'],
    [/[\\/]views[\\/]FotoOversikt\.tsx$/, 'export const FotoOversikt = () => null'],
    // Scenene fra tidligere utgaver (vises bare fra arkivet, som er tomt her)
    [/[\\/]scenes[\\/]Del1\.tsx$/, tomme('Innsikter', 'Metode', 'Portrett', 'TittelScene', 'Apning')],
    [/[\\/]scenes[\\/]Del2\.tsx$/, tomme('Ide', 'Pakket', 'Persona', 'Prinsipper', 'Sensor', 'Snu', 'ToInnsikter') + '\nexport const VALG = []'],
    [/[\\/]scenes[\\/]Del3\.tsx$/, tomme('Hopping', 'Nabc', 'Refleksjon', 'Slutt', 'Testing', 'Videre')],
    [/[\\/]scenes[\\/]Flyt\.tsx$/, tomme('Folk', 'Funn', 'Prioritert', 'Valg', 'Vakten', 'Vet')],
  ]
  return {
    name: 'uten-arbeidsnotater',
    enforce: 'pre',
    load(id) {
      const fil = id.split('?')[0]
      const tom = TOMME.find(([re]) => re.test(fil))
      return tom ? tom[1] : null
    },
    transform(kode, id) {
      const fil = id.split('?')[0]
      if (/[\\/]content[\\/]manus\.ts$/.test(fil)) {
        const ut = kode.replace(/\b(regi|overgang): '(?:[^'\\\n]|\\.)*'/g, "$1: ''").replace(/\bkilder: \[[^\]\n]*\]/g, 'kilder: []')
        if (/\b(regi|overgang): '[^']/.test(ut)) throw new Error('manus.ts: en regi eller overgang ble ikke tømt')
        return ut
      }
      if (/[\\/]lib[\\/](mobil|oppsett)\.ts$/.test(fil)) {
        const ut = kode.replace(/'https:\/\/[a-z0-9-]+\.github\.io\/[^']*'/g, "''")
        if (/'https:[^']*github\.io/.test(ut)) throw new Error(fil + ': en nettadresse står igjen')
        return ut
      }
      return null
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [utenArbeidsnotater(), react(), viteSingleFile()],
  define: { __EKSAMEN__: 'false' },
  // public/ kopieres ikke: pakkeskriptet henter det som trengs derfra
  publicDir: false,
  build: { outDir: 'dist-offline', assetsInlineLimit: 100_000_000 },
})
