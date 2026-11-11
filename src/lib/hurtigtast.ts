import { manus } from '../content/manus.ts'
import { gaTil, hent, start } from './sync.ts'

// Talltastene går rett til en del: 5 = del 5. Flere siffer tastes raskt etter hverandre (12 = del 12).
// Finnes det ikke noen del som begynner med sifferet og har flere siffer, går den med en gang.

let buffer = ''
let ur = 0

function ga() {
  const n = Number(buffer)
  buffer = ''
  if (n >= 1 && n <= manus.length) {
    if (!hent().startet) start()
    gaTil(n - 1, 0)
  }
}

/** Kalles med tasten som ble trykket. Returnerer true hvis det var et siffer (da er tasten brukt). */
export function tallTast(k: string): boolean {
  if (!/^[0-9]$/.test(k)) return false
  window.clearTimeout(ur)
  buffer += k
  // Kan det komme et siffer til som gir en gyldig del? Hvis ikke: gå nå.
  if (Number(buffer) * 10 > manus.length || buffer.length >= 2) ga()
  else ur = window.setTimeout(ga, 600)
  return true
}
