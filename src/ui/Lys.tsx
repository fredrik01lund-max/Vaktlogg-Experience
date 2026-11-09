import { useEffect, useRef } from 'react'

// Uskarpe, varme lys som i en restaurant om kvelden (bokeh). Tegnes på et lerret
// og brukes som bakgrunn der vi ikke har – eller ikke trenger – et fotografi.

type Props = { styrke?: number; antall?: number; className?: string; tema?: 'lys' | 'mork' }

// Mørkt: varme lys som i en restaurant om kvelden. Lyst: prototypens pastellflater som myke farge-skyer.
const VARME = ['255,200,150', '253,184,180', '246,162,200', '255,226,190', '233,194,122']
const PASTELL = ['255,217,179', '249,202,219', '191,233,211', '251,230,162', '255,214,174', '249,196,216']

export function Lys({ styrke = 1, antall = 34, className = '', tema = 'mork' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const styrkeRef = useRef(styrke)
  styrkeRef.current = styrke
  const temaRef = useRef(tema)
  temaRef.current = tema

  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const W = (c.width = 960)
    const H = (c.height = 540)
    // Fast «tilfeldighet», så lysene står likt hver gang
    let frø = 7
    const rnd = () => ((frø = (frø * 16807) % 2147483647) / 2147483647)
    const lys = Array.from({ length: antall }, () => ({
      x: rnd() * W,
      y: H * (0.15 + rnd() * 0.75),
      r: 18 + rnd() * 70,
      a: 0.05 + rnd() * 0.16,
      f: VARME[Math.floor(rnd() * VARME.length)],
      p: PASTELL[Math.floor(rnd() * PASTELL.length)],
      vx: (rnd() - 0.5) * 4,
      fase: rnd() * Math.PI * 2,
      flimmer: 0.6 + rnd() * 1.6,
    }))
    let id = 0
    let naaStyrke = 0
    const t0 = performance.now()
    const tegn = (naa: number) => {
      const t = (naa - t0) / 1000
      ctx.clearRect(0, 0, W, H)
      const lyst = temaRef.current === 'lys'
      ctx.globalCompositeOperation = lyst ? 'source-over' : 'lighter'
      // Glir mykt mot ønsket styrke, så scenene kan dimme lyset uten hopp
      naaStyrke += (styrkeRef.current - naaStyrke) * 0.035
      const s = naaStyrke
      if (s < 0.004) {
        id = requestAnimationFrame(tegn)
        return
      }
      for (const l of lys) {
        const x = (l.x + l.vx * t + W) % W
        const a = l.a * s * (0.75 + 0.25 * Math.sin(t * l.flimmer + l.fase))
        // Lyst tema: større og mykere flater i pastell
        const r = lyst ? l.r * 2.2 : l.r
        const f = lyst ? l.p : l.f
        const al = lyst ? Math.min(0.5, a * 2.2) : a
        const g = ctx.createRadialGradient(x, l.y, 0, x, l.y, r)
        g.addColorStop(0, `rgba(${f},${al})`)
        g.addColorStop(lyst ? 0.45 : 0.7, `rgba(${f},${al * 0.55})`)
        g.addColorStop(1, `rgba(${f},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, l.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      id = requestAnimationFrame(tegn)
    }
    id = requestAnimationFrame(tegn)
    return () => cancelAnimationFrame(id)
  }, [antall])

  return <canvas ref={ref} className={`lys-lerret ${className}`} aria-hidden="true" />
}
