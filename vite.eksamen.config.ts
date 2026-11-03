import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'node:fs'
import path from 'node:path'
import { fotoEksamen } from './vite.config.ts'

// Eksamensversjonen: én index.html (all kode og alle fonter innebygd) + mappene film/, foto/, demo/ og lyd/.
// Åpnes med dobbeltklikk – ingen server og ingen internett. Bilder fra foto-eksamen/ kopieres med,
// og bilder som bare er klarert for eksamen vises (se public/foto/foto.js).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    fotoEksamen(),
    viteSingleFile(),
    {
      name: 'kopier-eksamensbilder',
      closeBundle() {
        const fra = path.resolve(__dirname, 'foto-eksamen')
        const til = path.resolve(__dirname, 'dist-eksamen', 'foto')
        if (!fs.existsSync(fra)) return
        for (const f of fs.readdirSync(fra)) {
          if (f.startsWith('.') || f.toLowerCase() === 'les-meg.txt') continue
          fs.cpSync(path.join(fra, f), path.join(til, f), { recursive: true })
        }
      },
    },
  ],
  define: { __EKSAMEN__: 'true' },
  build: { outDir: 'dist-eksamen', assetsInlineLimit: 100_000_000 },
})
