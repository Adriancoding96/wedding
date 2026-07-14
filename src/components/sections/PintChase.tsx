import { useEffect, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Grid ─────────────────────────────────────────────────────────────────────
const CELL = 36, COLS = 19, ROWS = 13
const W = COLS * CELL, H = ROWS * CELL

const MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

const isOpen = (c: number, r: number) =>
  c >= 0 && c < COLS && r >= 0 && r < ROWS && MAZE[r][c] === 0

const TOTAL_PINTS = MAZE.flat().filter(v => v === 0).length

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ent {
  c: number; r: number       // destination / current cell
  fc: number; fr: number     // from cell
  t: number                  // lerp 0→1
  sp: number                 // speed (t per frame)
  dc: number; dr: number     // active direction
  qc: number; qr: number     // queued direction
}

type Status = 'idle' | 'playing' | 'dying' | 'won' | 'over'

interface GS {
  player: Ent
  ghosts: Ent[]
  pints: Uint8Array
  score: number
  left: number
  lives: number
  status: Status
  dT: number
  frame: number
  level: number
}

function mkEnt(c: number, r: number, dc = 0, dr = 0, sp = 0.08): Ent {
  return { c, r, fc: c, fr: r, t: 1, dc, dr, qc: dc, qr: dr, sp }
}

function initGame(level = 1): GS {
  const gsp = 0.05 + (level - 1) * 0.005
  const pints = new Uint8Array(COLS * ROWS)
  MAZE.forEach((row, r) => row.forEach((v, c) => { if (v === 0) pints[r * COLS + c] = 1 }))
  pints[1 * COLS + 1] = 0 // clear player start cell
  return {
    player: mkEnt(1, 1, 1, 0, 0.085),
    ghosts: [
      mkEnt(9, 6,  1,  0, gsp),
      mkEnt(9, 6, -1,  0, gsp),
      mkEnt(9, 6,  0, -1, gsp),
    ],
    pints,
    score: 0, left: TOTAL_PINTS - 1, lives: 3,
    status: 'idle', dT: 0, frame: 0, level,
  }
}

// ─── Movement ─────────────────────────────────────────────────────────────────
function advance(e: Ent): { e: Ent; justArrived: boolean } {
  if (e.t < 1) {
    const t = Math.min(1, e.t + e.sp)
    return { e: { ...e, t }, justArrived: t >= 1 }
  }
  // Try queued direction
  let nc = e.c + e.qc, nr = e.r + e.qr
  if ((e.qc !== 0 || e.qr !== 0) && isOpen(nc, nr)) {
    return { e: { ...e, c: nc, r: nr, fc: e.c, fr: e.r, dc: e.qc, dr: e.qr, t: 0 }, justArrived: false }
  }
  // Try current direction
  nc = e.c + e.dc; nr = e.r + e.dr
  if ((e.dc !== 0 || e.dr !== 0) && isOpen(nc, nr)) {
    return { e: { ...e, c: nc, r: nr, fc: e.c, fr: e.r, t: 0 }, justArrived: false }
  }
  return { e, justArrived: false }
}

const DIRS4: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]]

function ghostAI(g: Ent, player: Ent): Ent {
  if (g.t < 1) return g
  const valid = DIRS4.filter(([dc, dr]) =>
    isOpen(g.c + dc, g.r + dr) && !(dc === -g.dc && dr === -g.dr)
  )
  if (valid.length === 0) return g
  const chosen = Math.random() < 0.72
    ? valid.reduce((best, d) => {
        const bd = Math.abs(g.c + best[0] - player.c) + Math.abs(g.r + best[1] - player.r)
        const dd = Math.abs(g.c + d[0] - player.c) + Math.abs(g.r + d[1] - player.r)
        return dd < bd ? d : best
      })
    : valid[Math.floor(Math.random() * valid.length)]
  return { ...g, qc: chosen[0], qr: chosen[1] }
}

const epx = (e: Ent) => (e.fc + (e.c - e.fc) * e.t) * CELL
const epy = (e: Ent) => (e.fr + (e.r - e.fr) * e.t) * CELL

// ─── Drawing ──────────────────────────────────────────────────────────────────
function drawBg(ctx: CanvasRenderingContext2D) {
  MAZE.forEach((row, r) => row.forEach((v, c) => {
    if (v === 1) {
      ctx.fillStyle = '#1E4035'
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL)
      ctx.strokeStyle = 'rgba(144,138,50,0.2)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(c * CELL + 1.5, r * CELL + 1.5, CELL - 3, CELL - 3)
    } else {
      ctx.fillStyle = '#0c1e14'
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL)
    }
  }))
}

function drawPints(ctx: CanvasRenderingContext2D, pints: Uint8Array) {
  MAZE.forEach((row, r) => row.forEach((_, c) => {
    if (!pints[r * COLS + c]) return
    const cx = c * CELL + CELL / 2, cy = r * CELL + CELL / 2
    const s = CELL * 0.34   // glass scale
    const gh = s * 1.55     // glass height
    const gt = s * 0.52     // glass top half-width
    const gb = s * 0.4      // glass bottom half-width
    const gTop = cy - gh * 0.52
    const gBot = cy + gh * 0.48

    // Glass body (slightly tapered — wider at top like a real pint)
    ctx.fillStyle = '#0a0500'
    ctx.beginPath()
    ctx.moveTo(cx - gb, gBot)
    ctx.lineTo(cx - gt, gTop)
    ctx.lineTo(cx + gt, gTop)
    ctx.lineTo(cx + gb, gBot)
    ctx.closePath()
    ctx.fill()

    // Guinness body — very dark ruby/brown
    const bodyGrad = ctx.createLinearGradient(cx - gt, gTop, cx + gt, gTop)
    bodyGrad.addColorStop(0, '#1a0800')
    bodyGrad.addColorStop(0.35, '#2d1005')
    bodyGrad.addColorStop(0.65, '#1a0800')
    bodyGrad.addColorStop(1, '#0a0300')
    ctx.fillStyle = bodyGrad
    const inset = s * 0.04
    ctx.beginPath()
    ctx.moveTo(cx - gb + inset, gBot - inset)
    ctx.lineTo(cx - gt + inset, gTop + gh * 0.22)
    ctx.lineTo(cx + gt - inset, gTop + gh * 0.22)
    ctx.lineTo(cx + gb - inset, gBot - inset)
    ctx.closePath()
    ctx.fill()

    // Settling layer — brown surge band just below foam
    const surgeY = gTop + gh * 0.22
    ctx.fillStyle = 'rgba(120,50,10,0.5)'
    ctx.beginPath()
    ctx.moveTo(cx - gt + inset, surgeY)
    ctx.lineTo(cx + gt - inset, surgeY)
    ctx.lineTo(cx + gt - inset, surgeY + gh * 0.08)
    ctx.lineTo(cx - gt + inset, surgeY + gh * 0.08)
    ctx.closePath()
    ctx.fill()

    // Foam head — creamy white with slight dome
    const foamBot = gTop + gh * 0.22
    const foamTop = gTop
    const foamGrad = ctx.createLinearGradient(cx, foamTop, cx, foamBot)
    foamGrad.addColorStop(0, '#fff8e8')
    foamGrad.addColorStop(0.5, '#f0dfa0')
    foamGrad.addColorStop(1, '#d4bc6a')
    ctx.fillStyle = foamGrad
    ctx.beginPath()
    ctx.moveTo(cx - gt + inset, foamBot)
    ctx.lineTo(cx - gt + inset, foamTop + s * 0.06)
    ctx.quadraticCurveTo(cx, foamTop - s * 0.08, cx + gt - inset, foamTop + s * 0.06)
    ctx.lineTo(cx + gt - inset, foamBot)
    ctx.closePath()
    ctx.fill()

    // Foam bubble texture
    ctx.fillStyle = 'rgba(255,252,235,0.6)'
    for (const [bx, by, br] of [
      [cx - s*0.12, foamTop + s*0.08, s*0.045],
      [cx + s*0.08, foamTop + s*0.05, s*0.035],
      [cx - s*0.02, foamTop + s*0.13, s*0.04],
      [cx + s*0.18, foamTop + s*0.11, s*0.03],
      [cx - s*0.2,  foamTop + s*0.12, s*0.03],
    ] as [number,number,number][]) {
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill()
    }

    // Glass highlight (left reflection)
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.beginPath()
    ctx.moveTo(cx - gt + inset + s*0.04, gTop + gh*0.25)
    ctx.lineTo(cx - gt + inset + s*0.12, gTop + gh*0.25)
    ctx.lineTo(cx - gb + inset + s*0.1,  gBot - inset)
    ctx.lineTo(cx - gb + inset + s*0.02, gBot - inset)
    ctx.closePath()
    ctx.fill()

    // Glass outline
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(cx - gb, gBot)
    ctx.lineTo(cx - gt, gTop)
    ctx.moveTo(cx + gt, gTop)
    ctx.lineTo(cx + gb, gBot)
    ctx.stroke()
  }))
}

function drawSheep(ctx: CanvasRenderingContext2D, e: Ent, frame: number) {
  const x = epx(e), y = epy(e)
  const cx = x + CELL / 2, cy = y + CELL / 2, s = CELL
  const moving = e.t < 1 || (e.dc !== 0 || e.dr !== 0)
  const swing = moving ? Math.sin(frame * 0.28) * s * 0.08 : 0

  // Legs
  ctx.strokeStyle = '#555'; ctx.lineWidth = s * 0.065; ctx.lineCap = 'round'
  for (const [ox, dir] of [[-0.16, 1], [-0.05, -1], [0.05, 1], [0.16, -1]] as [number, number][]) {
    ctx.beginPath()
    ctx.moveTo(cx + ox * s, cy + s * 0.18)
    ctx.lineTo(cx + ox * s + dir * swing, cy + s * 0.38)
    ctx.stroke()
  }

  // Body
  ctx.fillStyle = '#dedad2'
  ctx.beginPath(); ctx.ellipse(cx, cy - s * 0.04, s * 0.33, s * 0.23, 0, 0, Math.PI * 2); ctx.fill()
  // Wool puffs
  ctx.fillStyle = '#f6f3ed'
  const puffs: [number, number][] = [[0,-0.2],[0.18,-0.1],[0.25,0.06],[0.18,0.18],[0,0.22],[-0.18,0.18],[-0.25,0.06],[-0.18,-0.1]]
  for (const [ox, oy] of puffs) {
    ctx.beginPath(); ctx.arc(cx + ox * s, cy + oy * s, s * 0.14, 0, Math.PI * 2); ctx.fill()
  }

  // Head — offset in direction of travel
  const hx = cx + e.dc * s * 0.33
  const hy = cy + e.dr * s * 0.28 - (e.dr === 0 ? s * 0.26 : 0)

  // Ears
  ctx.fillStyle = '#f0c0a0'
  ctx.beginPath(); ctx.ellipse(hx - s * 0.1, hy - s * 0.1, s * 0.055, s * 0.09, -0.4, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(hx + s * 0.1, hy - s * 0.1, s * 0.055, s * 0.09,  0.4, 0, Math.PI * 2); ctx.fill()

  // Head
  ctx.fillStyle = '#28231e'
  ctx.beginPath(); ctx.ellipse(hx, hy, s * 0.14, s * 0.16, 0, 0, Math.PI * 2); ctx.fill()

  // Eyes
  ctx.fillStyle = 'white'
  ctx.beginPath(); ctx.arc(hx - s * 0.056, hy - s * 0.03, s * 0.042, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(hx + s * 0.056, hy - s * 0.03, s * 0.042, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#111'
  ctx.beginPath(); ctx.arc(hx - s * 0.048 + e.dc * s * 0.012, hy - s * 0.03 + e.dr * s * 0.012, s * 0.024, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(hx + s * 0.063 + e.dc * s * 0.012, hy - s * 0.03 + e.dr * s * 0.012, s * 0.024, 0, Math.PI * 2); ctx.fill()
}

function drawHungover(ctx: CanvasRenderingContext2D, e: Ent, frame: number) {
  const x = epx(e), y = epy(e)
  const cx = x + CELL / 2, cy = y + CELL / 2, s = CELL
  const r = s * 0.36, w = Math.sin(frame * 0.07) * 1.8

  const grad = ctx.createRadialGradient(cx + w, cy - r * 0.15, r * 0.1, cx + w, cy, r * 1.1)
  grad.addColorStop(0, '#b2e85a'); grad.addColorStop(1, '#4d8820')
  ctx.fillStyle = grad

  const by = cy + r * 0.88
  ctx.beginPath()
  ctx.arc(cx + w, cy - r * 0.08, r, Math.PI, 0)
  ctx.quadraticCurveTo(cx + r * 0.75 + w, by + r * 0.32, cx + r * 0.5 + w, by)
  ctx.quadraticCurveTo(cx + r * 0.25 + w, by - r * 0.3, cx + w,            by + r * 0.14)
  ctx.quadraticCurveTo(cx - r * 0.25 + w, by + r * 0.38, cx - r * 0.5 + w, by)
  ctx.quadraticCurveTo(cx - r * 0.75 + w, by - r * 0.24, cx - r + w,       by + r * 0.1)
  ctx.lineTo(cx - r + w, cy - r * 0.08)
  ctx.fill()

  // X eyes
  const ey = cy - r * 0.05, es = r * 0.18
  ctx.strokeStyle = '#cc0000'; ctx.lineWidth = s * 0.065; ctx.lineCap = 'round'
  for (const ex of [cx - r * 0.34 + w, cx + r * 0.34 + w]) {
    ctx.beginPath(); ctx.moveTo(ex - es, ey - es); ctx.lineTo(ex + es, ey + es); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(ex + es, ey - es); ctx.lineTo(ex - es, ey + es); ctx.stroke()
  }

  // Grimace
  ctx.strokeStyle = '#1a3600'; ctx.lineWidth = s * 0.055
  ctx.beginPath(); ctx.arc(cx + w, ey + r * 0.5, r * 0.2, 0.2, Math.PI - 0.2); ctx.stroke()

  // Sweat drop
  ctx.fillStyle = 'rgba(140,200,255,0.75)'
  ctx.beginPath(); ctx.arc(cx + r * 0.62 + w, ey - r * 0.38, r * 0.08, 0, Math.PI * 2); ctx.fill()
}

function overlay(ctx: CanvasRenderingContext2D, title: string, sub: string, sub2 = '') {
  ctx.fillStyle = 'rgba(0,0,0,0.62)'
  ctx.fillRect(0, 0, W, H)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFF1BD'
  ctx.font = `bold ${CELL * 1.05}px 'Seaweed Script', cursive`
  ctx.fillText(title, W / 2, H / 2 - CELL * 0.7)
  ctx.font = `${CELL * 0.52}px Inter, sans-serif`
  ctx.fillStyle = '#E69E93'
  ctx.fillText(sub, W / 2, H / 2 + CELL * 0.3)
  if (sub2) {
    ctx.font = `${CELL * 0.42}px Inter, sans-serif`
    ctx.fillStyle = 'rgba(255,241,189,0.55)'
    ctx.fillText(sub2, W / 2, H / 2 + CELL * 1.0)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const btnStyle: CSSProperties = {
  width: 48, height: 48,
  background: 'rgba(255,241,189,0.12)',
  border: '1px solid rgba(255,241,189,0.3)',
  color: '#FFF1BD', fontSize: '1.2rem',
  cursor: 'pointer', borderRadius: 4,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  userSelect: 'none', WebkitUserSelect: 'none',
}

export default function PintChase() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gs = useRef<GS>(initGame())
  const raf = useRef(0)
  const [ui, setUi] = useState({ score: 0, lives: 3, status: 'idle' as Status, level: 1 })

  const setDir = useCallback((dc: number, dr: number) => {
    const s = gs.current
    if (s.status === 'idle') {
      s.status = 'playing'
      setUi(u => ({ ...u, status: 'playing' }))
    }
    if (s.status !== 'playing') return
    s.player.qc = dc
    s.player.qr = dr
  }, [])

  const restart = useCallback(() => {
    const lvl = gs.current.status === 'won' ? gs.current.level + 1 : 1
    gs.current = initGame(lvl)
    gs.current.status = 'playing'
    setUi({ score: 0, lives: 3, status: 'playing', level: lvl })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const onKey = (e: KeyboardEvent) => {
      const wasd = ['KeyW','KeyA','KeyS','KeyD','w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ']
      if (wasd.includes(e.code) || wasd.includes(e.key)) e.preventDefault()

      const map: Record<string, [number, number]> = {
        ArrowRight: [1,0], ArrowLeft: [-1,0], ArrowDown: [0,1], ArrowUp: [0,-1],
        KeyD: [1,0], KeyA: [-1,0], KeyS: [0,1], KeyW: [0,-1],
        d: [1,0], a: [-1,0], s: [0,1], w: [0,-1],
        D: [1,0], A: [-1,0], S: [0,1], W: [0,-1],
      }
      const d = map[e.code] ?? map[e.key]
      if (d) setDir(d[0], d[1])
      if (e.key === 'Enter' || e.key === ' ') {
        const st = gs.current.status
        if (st === 'over' || st === 'won' || st === 'idle') restart()
      }
    }
    window.addEventListener('keydown', onKey)

    function loop() {
      const s = gs.current
      s.frame++
      const ctx2 = ctx

      if (s.status === 'playing') {
        // Player
        const { e: pe, justArrived } = advance(s.player)
        s.player = pe
        if (justArrived) {
          const pi = s.player.r * COLS + s.player.c
          if (s.pints[pi]) {
            s.pints[pi] = 0
            s.score += 10
            s.left--
            if (s.left === 0) {
              s.status = 'won'
              setUi(u => ({ ...u, score: s.score, status: 'won' }))
            } else {
              setUi(u => ({ ...u, score: s.score }))
            }
          }
        }

        // Ghosts
        s.ghosts = s.ghosts.map(g => {
          const smart = ghostAI(g, s.player)
          return advance(smart).e
        })

        // Collision
        const ppx = epx(s.player) + CELL / 2
        const ppy = epy(s.player) + CELL / 2
        for (const g of s.ghosts) {
          const gpx = epx(g) + CELL / 2
          const gpy = epy(g) + CELL / 2
          if (Math.abs(ppx - gpx) < CELL * 0.65 && Math.abs(ppy - gpy) < CELL * 0.65) {
            s.lives--
            if (s.lives <= 0) {
              s.status = 'over'
              setUi(u => ({ ...u, lives: 0, status: 'over' }))
            } else {
              s.status = 'dying'
              s.dT = 100
              setUi(u => ({ ...u, lives: s.lives, status: 'dying' }))
            }
            break
          }
        }
      }

      if (s.status === 'dying') {
        s.dT--
        if (s.dT <= 0) {
          const gsp = s.ghosts[0].sp
          s.player = mkEnt(1, 1, 1, 0, 0.085)
          s.ghosts = [
            mkEnt(9, 6,  1,  0, gsp),
            mkEnt(9, 6, -1,  0, gsp),
            mkEnt(9, 6,  0, -1, gsp),
          ]
          s.status = 'playing'
          setUi(u => ({ ...u, status: 'playing' }))
        }
      }

      // Render
      ctx2.clearRect(0, 0, W, H)
      drawBg(ctx2)
      drawPints(ctx2, s.pints)

      for (const g of s.ghosts) drawHungover(ctx2, g, s.frame)

      // Sheep — blink while dying
      if (s.status !== 'dying' || s.frame % 10 < 6) {
        drawSheep(ctx2, s.player, s.frame)
      }

      if (s.status === 'idle')  overlay(ctx2, 'Pint Chase', 'Arrow keys to start — eat the Guinness!', 'Watch out for the Hungover...')
      if (s.status === 'over')  overlay(ctx2, 'Game Over', `Score: ${s.score}`, 'Press Enter or Space to try again')
      if (s.status === 'won')   overlay(ctx2, 'All Pints Down!', `Score: ${s.score} — Next round?`, 'Press Enter or Space to continue')

      raf.current = requestAnimationFrame(loop)
    }

    raf.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('keydown', onKey) }
  }, [setDir, restart])

  return (
    <section id="game" style={{ backgroundColor: '#0a1a10', padding: 'clamp(4rem,8vw,6rem) 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Pre-wedding entertainment
          </p>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#FFF1BD', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, margin: '0 0 0.5rem' }}>
            Pint Chase
          </h2>
          <p style={{ color: '#FFF1BD', opacity: 0.5, fontSize: '0.82rem', letterSpacing: '0.04em' }}>
            Arrow keys or WASD to move &nbsp;·&nbsp; Eat the pints &nbsp;·&nbsp; Dodge the Hungover
          </p>
        </div>

        {/* HUD */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          maxWidth: W, margin: '0 auto 0.6rem',
          color: '#FFF1BD', fontSize: '0.88rem', letterSpacing: '0.05em',
        }}>
          <span>Score: <strong style={{ color: '#E78D5A' }}>{ui.score}</strong></span>
          <span>Level: <strong style={{ color: '#908A32' }}>{ui.level}</strong></span>
          <span>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} style={{ opacity: i < ui.lives ? 1 : 0.2, marginRight: 2, fontSize: '0.9rem' }}>♥</span>
            ))}
          </span>
        </div>

        {/* Canvas */}
        <div style={{ maxWidth: W, margin: '0 auto', overflowX: 'auto', borderRadius: 2 }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{ display: 'block', imageRendering: 'pixelated' }}
          />
        </div>

        {/* Mobile D-pad */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginTop: '1.2rem' }}>
          <button style={btnStyle} onClick={() => setDir(0, -1)}>▲</button>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button style={btnStyle} onClick={() => setDir(-1, 0)}>◀</button>
            <div style={{ width: 48 }} />
            <button style={btnStyle} onClick={() => setDir(1, 0)}>▶</button>
          </div>
          <button style={btnStyle} onClick={() => setDir(0, 1)}>▼</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={restart}
            style={{
              background: 'none', border: '1px solid rgba(255,241,189,0.3)',
              color: '#FFF1BD', opacity: 0.5, fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0.4rem 1rem', cursor: 'pointer', borderRadius: 2,
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </section>
  )
}
