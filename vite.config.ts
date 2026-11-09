import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Bilder som bare er klarert for eksamen ligger i foto-eksamen/ (aldri i git).
// Utviklingsserveren viser dem under /foto/ slik at gruppen kan øve med dem lokalt.
export function fotoEksamen(): Plugin {
  const mappe = path.resolve(__dirname, 'foto-eksamen')
  return {
    name: 'foto-eksamen',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = req.url?.match(/^\/foto\/([^?#]+)/)
        if (!m) return next()
        const fil = path.join(mappe, decodeURIComponent(m[1]))
        if (!fil.startsWith(mappe) || !fs.existsSync(fil) || !fs.statSync(fil).isFile()) return next()
        fs.createReadStream(fil).pipe(res)
      })
    },
  }
}

// GitHub Pages: relative stier, så siden virker under /Vaktlogg-Experience/ og i alle undermapper.
export default defineConfig({
  base: './',
  plugins: [react(), fotoEksamen()],
  define: { __EKSAMEN__: 'false' },
})
