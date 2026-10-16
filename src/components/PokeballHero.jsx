import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const S = 280 
function buildParticles() {
  const o = document.createElement("canvas")
  o.width = o.height = S
  const c = o.getContext("2d")
  c.translate(S / 2, S / 2)
  c.fillStyle = "#ee1515"; c.beginPath(); c.arc(0, 0, 130, Math.PI, 0); c.fill()
  c.fillStyle = "#f4f4f4"; c.beginPath(); c.arc(0, 0, 130, 0, Math.PI); c.fill()
  c.fillStyle = "#fff"; c.globalAlpha = 0.35; c.beginPath(); c.ellipse(-50, -70, 38, 18, -0.6, 0, 7); c.fill(); c.globalAlpha = 1
  c.fillStyle = "#1d1d2b"; c.fillRect(-130, -10, 260, 20); c.beginPath(); c.arc(0, 0, 40, 0, 7); c.fill()
  c.fillStyle = "#fff"; c.beginPath(); c.arc(0, 0, 24, 0, 7); c.fill()
  c.strokeStyle = "#1d1d2b"; c.lineWidth = 9; c.beginPath(); c.arc(0, 0, 130, 0, 7); c.stroke()
  const d = c.getImageData(0, 0, S, S).data
  const pts = []
  for (let y = 0; y < S; y += 3)
    for (let x = 0; x < S; x += 3) {
      const i = (y * S + x) * 4
      if (d[i + 3] > 128)
        pts.push({
          hx: x - S / 2, hy: y - S / 2, c: `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`,
          x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: 0, vy: 0,
        })
    }
  return pts
}

export default function PokeballHero() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current, cv = canvasRef.current, cx = cv.getContext("2d")
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const P = buildParticles()
    const m = { x: -999, y: -999, on: false }
    let W, H, sc, ox, oy, raf

    const size = () => {
      const r = hero.getBoundingClientRect(), D = Math.min(devicePixelRatio || 1, 2)
      W = r.width; H = r.height
      cv.width = W * D; cv.height = H * D
      cx.setTransform(D, 0, 0, D, 0, 0)
      const mob = W < 700
      sc = (mob ? Math.min(W * 0.8, H * 0.4) : Math.min(W * 0.42, H * 0.8)) / S * 1.1
      ox = mob ? W / 2 : W * 0.72
      oy = mob ? H * 0.74 : H * 0.52
    }

    const tick = () => {
      cx.clearRect(0, 0, W, H)
      const R = sc * 70
      for (const p of P) {
        const hx = ox + p.hx * sc, hy = oy + p.hy * sc
        const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy
        if (m.on && d2 < R * R) {
          const d = Math.sqrt(d2) + 1, f = 1 - d / R
          p.vx += (dx / d) * f * 2.2 - (dy / d) * f * 1.6
          p.vy += (dy / d) * f * 2.2 + (dx / d) * f * 1.6
        }
        p.vx += (hx - p.x) * 0.018; p.vy += (hy - p.y) * 0.018
        p.vx *= 0.9; p.vy *= 0.9
        p.x += p.vx; p.y += p.vy
        cx.fillStyle = p.c
        cx.fillRect(p.x, p.y, sc * 3.2, sc * 3.2)
      }
      if (!reduce) raf = requestAnimationFrame(tick)
    }

    const pos = (e) => {
      const r = hero.getBoundingClientRect()
      m.x = e.clientX - r.left; m.y = e.clientY - r.top; m.on = true
    }
    const off = () => (m.on = false)
    const up = (e) => e.pointerType === "touch" && off()

    size()
    if (reduce) for (const p of P) { p.x = ox + p.hx * sc; p.y = oy + p.hy * sc }
    tick()
    addEventListener("resize", size)
    hero.addEventListener("pointermove", pos)
    hero.addEventListener("pointerdown", pos)
    hero.addEventListener("pointerleave", off)
    hero.addEventListener("pointerup", up)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("resize", size)
      hero.removeEventListener("pointermove", pos)
      hero.removeEventListener("pointerdown", pos)
      hero.removeEventListener("pointerleave", off)
      hero.removeEventListener("pointerup", up)
    }
  }, [])

  const rise = (delay) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, type: "spring", stiffness: 120, damping: 18 },
  })

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <canvas ref={canvasRef} className="hero-fx" aria-hidden="true" />
      <div className="copy">
        <motion.span className="tag px" {...rise(0.1)}>POKÉDEX INTERACTIVA</motion.span>
        <motion.h2 className="px hero-title" {...rise(0.2)}>
          Atrápalos o Miralos <span>a todos.</span>
        </motion.h2>
        <motion.p {...rise(0.3)}>
          Explora todos los Pokémon de la PokéAPI con búsqueda, tipos y paginación.

        </motion.p>
        <motion.div className="cta" {...rise(0.4)}>
          <motion.a className="btn" href="#pokedex" whileHover={{ y: 2 }} whileTap={{ scale: 0.95 }}>Explorar Pokédex</motion.a>
          <motion.a className="btn alt" href="https://pokeapi.co" target="_blank" rel="noopener" whileHover={{ y: 2 }} whileTap={{ scale: 0.95 }}>Ver PokéAPI</motion.a>
        </motion.div>
      </div>
    </section>
  )
}
