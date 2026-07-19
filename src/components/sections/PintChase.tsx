import { useEffect, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 560, H = 480
const ALIEN_COLS = 10, ALIEN_ROWS = 5
const ALIEN_SLOT_W = 50, ALIEN_SLOT_H = 38
const ALIEN_GRID_LEFT = (W - ALIEN_COLS * ALIEN_SLOT_W) / 2   // = 30
const ALIEN_GRID_TOP  = 52
const PLAYER_W = 44, PLAYER_H = 28
const PLAYER_Y = H - 48
const PLAYER_SPEED       = 3.5
const PLAYER_BULLET_SPD  = 10
const ALIEN_BULLET_SPD   = 4
const ALIEN_STEP_X       = 10
const ALIEN_STEP_DOWN    = 22

// Seeded stars so they don't re-randomise each render
const STARS = (() => {
  const list: { x: number; y: number; r: number; a: number }[] = []
  let s = 0xdeadbeef
  const rand = () => { s = ((s * 1664525) + 1013904223) >>> 0; return s / 0xffffffff }
  for (let i = 0; i < 90; i++)
    list.push({ x: rand() * W, y: rand() * H, r: rand() * 1.4 + 0.4, a: rand() * 0.5 + 0.5 })
  return list
})()

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bullet    { x: number; y: number; player: boolean }
interface Alien     { col: number; row: number; alive: boolean; type: number }
interface Explosion { x: number; y: number; t: number }

type Status = 'idle' | 'playing' | 'dying' | 'won' | 'over'

interface GS {
  playerX: number
  inputL: boolean
  inputR: boolean
  bullets: Bullet[]
  aliens: Alien[]
  explosions: Explosion[]
  dirX: number          // fleet direction: +1 or -1
  offsetX: number       // fleet horizontal drift from start
  offsetY: number       // fleet vertical drift from start
  moveTimer: number
  moveInterval: number  // frames between fleet steps
  fireTimer: number
  fireCooldown: number  // player refire delay
  score: number
  lives: number
  status: Status
  frame: number
  level: number
  dT: number            // dying countdown
  powerup: { x: number; y: number; timer: number } | null
  powerupTimer: number   // frames remaining (300 = 5 s at 60 fps)
  powerupSpawn: number   // countdown to next spawn attempt
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function initAliens(): Alien[] {
  const out: Alien[] = []
  for (let r = 0; r < ALIEN_ROWS; r++)
    for (let c = 0; c < ALIEN_COLS; c++)
      out.push({ col: c, row: r, alive: true, type: r < 2 ? 0 : r < 4 ? 1 : 2 })
  return out
}

function initGame(level = 1): GS {
  return {
    playerX: W / 2,
    inputL: false, inputR: false,
    bullets: [], aliens: initAliens(), explosions: [],
    dirX: 1, offsetX: 0, offsetY: 0,
    moveTimer: 0,
    moveInterval: Math.max(6, 30 - (level - 1) * 4),
    fireTimer: 0, fireCooldown: 0,
    score: 0, lives: 3, status: 'idle',
    frame: 0, level, dT: 0,
    powerup: null, powerupTimer: 0, powerupSpawn: 480,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const alienCX = (s: GS, col: number) =>
  ALIEN_GRID_LEFT + s.offsetX + col * ALIEN_SLOT_W + ALIEN_SLOT_W / 2
const alienCY = (s: GS, row: number) =>
  ALIEN_GRID_TOP  + s.offsetY + row * ALIEN_SLOT_H + ALIEN_SLOT_H / 2


// ─── Drawing ──────────────────────────────────────────────────────────────────
function drawBg(ctx: CanvasRenderingContext2D, frame: number) {
  ctx.fillStyle = '#06080f'
  ctx.fillRect(0, 0, W, H)
  for (const st of STARS) {
    const tw = 0.65 + 0.35 * Math.sin(frame * 0.025 + st.x * 0.3)
    ctx.fillStyle = `rgba(240,240,210,${(st.a * tw).toFixed(2)})`
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill()
  }
  ctx.strokeStyle = 'rgba(80,200,120,0.45)'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, H - 22); ctx.lineTo(W, H - 22); ctx.stroke()
}

function drawAlien(ctx: CanvasRenderingContext2D, x: number, y: number, type: number, frame: number) {
  const anim = (Math.floor(frame / 14) & 1)
  const COLORS = ['#E69E93', '#c8b830', '#FFF1BD']
  const col = COLORS[type]

  if (type === 0) {
    // Small crab – top rows (30 pts)
    const s = 11
    ctx.fillStyle = col
    ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.65, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#06080f'
    ctx.beginPath(); ctx.arc(x - s * 0.38, y - s * 0.08, s * 0.25, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + s * 0.38, y - s * 0.08, s * 0.25, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = col; ctx.lineWidth = 1.6
    const aShift = anim ? 0.25 : -0.25
    ctx.beginPath(); ctx.moveTo(x - s * 0.35, y - s * 0.62); ctx.lineTo(x - s * 0.65, y - s * (1.05 + aShift)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + s * 0.35, y - s * 0.62); ctx.lineTo(x + s * 0.65, y - s * (1.05 + aShift)); ctx.stroke()
    const lShift = anim ? 0.25 : 0
    ctx.beginPath(); ctx.moveTo(x - s * 0.75, y + s * 0.15); ctx.lineTo(x - s * (1.1 + lShift), y + s * 0.7); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + s * 0.75, y + s * 0.15); ctx.lineTo(x + s * (1.1 + lShift), y + s * 0.7); ctx.stroke()

  } else if (type === 1) {
    // Medium squid – mid rows (20 pts)
    const s = 13
    ctx.fillStyle = col
    ctx.beginPath(); ctx.ellipse(x, y - 2, s, s * 0.58, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#06080f'
    ctx.beginPath(); ctx.arc(x - s * 0.38, y - s * 0.28, s * 0.26, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + s * 0.38, y - s * 0.28, s * 0.26, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = col; ctx.lineWidth = 1.8
    const tOffs = anim ? s * 0.18 : 0
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(x + i * s * 0.38, y + s * 0.38)
      ctx.lineTo(x + i * s * 0.38, y + s * 0.82 + (Math.abs(i) === 2 ? tOffs : 0))
      ctx.stroke()
    }
    const armY = anim ? y + s * 0.12 : y - s * 0.12
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * 1.3, armY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + s, y); ctx.lineTo(x + s * 1.3, armY); ctx.stroke()

  } else {
    // Large mushroom – bottom row (10 pts)
    const s = 15
    ctx.fillStyle = col
    ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.6, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#06080f'
    ctx.beginPath(); ctx.arc(x - s * 0.38, y - s * 0.05, s * 0.28, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + s * 0.38, y - s * 0.05, s * 0.28, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#06080f'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(x, y + s * 0.18, s * 0.28, 0.1, Math.PI - 0.1); ctx.stroke()
    ctx.fillStyle = col
    const knobX = anim ? s * 0.6 : s * 0.5
    ctx.beginPath(); ctx.arc(x - knobX, y - s * 0.55, s * 0.2, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + knobX, y - s * 0.55, s * 0.2, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = col; ctx.lineWidth = 2
    for (let i = -2; i <= 2; i++) {
      const footY = y + s * (0.55 + (anim && Math.abs(i) > 1 ? 0.18 : 0))
      ctx.beginPath(); ctx.moveTo(x + i * s * 0.36, y + s * 0.55); ctx.lineTo(x + i * s * 0.36, footY); ctx.stroke()
    }
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, blink: boolean, frame: number) {
  if (blink && (frame & 7) < 4) return
  const y = PLAYER_Y
  const grd = ctx.createRadialGradient(x, y + PLAYER_H / 2, 0, x, y + PLAYER_H / 2, 22)
  grd.addColorStop(0, 'rgba(80,200,120,0.55)'); grd.addColorStop(1, 'rgba(80,200,120,0)')
  ctx.fillStyle = grd; ctx.fillRect(x - 22, y, 44, 22)
  ctx.fillStyle = '#50C878'
  ctx.beginPath()
  ctx.moveTo(x, y - PLAYER_H / 2)
  ctx.lineTo(x + PLAYER_W / 2, y + PLAYER_H / 2)
  ctx.lineTo(x - PLAYER_W / 2, y + PLAYER_H / 2)
  ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#FFF1BD'
  ctx.beginPath(); ctx.arc(x, y + 4, PLAYER_W * 0.17, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.moveTo(x, y - PLAYER_H / 2)
  ctx.lineTo(x + PLAYER_W * 0.24, y + PLAYER_H / 2)
  ctx.lineTo(x, y + PLAYER_H * 0.12)
  ctx.closePath(); ctx.fill()
}

function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  if (b.player) {
    const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + 13)
    g.addColorStop(0, '#afffaf'); g.addColorStop(1, 'rgba(80,200,120,0)')
    ctx.fillStyle = g; ctx.fillRect(b.x - 2, b.y, 4, 13)
  } else {
    ctx.fillStyle = '#ff6040'; ctx.fillRect(b.x - 2, b.y, 4, 10)
  }
}

function drawExplosion(ctx: CanvasRenderingContext2D, ex: Explosion) {
  const p = 1 - ex.t / 20
  const alpha = 1 - p
  const r = 6 + p * 18
  ctx.strokeStyle = `rgba(255,180,60,${alpha.toFixed(2)})`; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(ex.x, ex.y, r, 0, Math.PI * 2); ctx.stroke()
  ctx.strokeStyle = `rgba(255,90,30,${(alpha * 0.55).toFixed(2)})`
  ctx.beginPath(); ctx.arc(ex.x, ex.y, r * 0.55, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = `rgba(255,220,80,${alpha.toFixed(2)})`
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + p * 1.8
    ctx.beginPath(); ctx.arc(ex.x + Math.cos(a) * r * 1.1, ex.y + Math.sin(a) * r * 1.1, 2.2, 0, Math.PI * 2); ctx.fill()
  }
}

function drawGuinness(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const gy = y + Math.sin(frame * 0.08) * 2

  // Glow
  const grd = ctx.createRadialGradient(x, gy, 0, x, gy, 24)
  grd.addColorStop(0, 'rgba(255,200,50,0.35)'); grd.addColorStop(1, 'rgba(255,200,50,0)')
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, gy, 24, 0, Math.PI * 2); ctx.fill()

  // Beer body (dark Guinness colour)
  ctx.fillStyle = '#1a0902'
  ctx.beginPath()
  ctx.moveTo(x - 7, gy - 9); ctx.lineTo(x + 7, gy - 9)
  ctx.lineTo(x + 5.5, gy + 11); ctx.lineTo(x - 5.5, gy + 11)
  ctx.closePath(); ctx.fill()

  // Foam head
  ctx.fillStyle = '#f0e8d8'
  ctx.beginPath(); ctx.ellipse(x, gy - 10, 7.5, 3.8, 0, 0, Math.PI * 2); ctx.fill()

  // Glass outline
  ctx.strokeStyle = 'rgba(255,241,189,0.85)'; ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(x - 7, gy - 9); ctx.lineTo(x + 7, gy - 9)
  ctx.lineTo(x + 5.5, gy + 11); ctx.lineTo(x - 5.5, gy + 11)
  ctx.closePath(); ctx.stroke()
  ctx.beginPath(); ctx.ellipse(x, gy - 10, 7.5, 3.8, 0, 0, Math.PI * 2); ctx.stroke()

  // Label stripe
  ctx.fillStyle = 'rgba(255,241,189,0.18)'
  ctx.fillRect(x - 4.5, gy - 3, 9, 5)
}

function drawOverlay(ctx: CanvasRenderingContext2D, title: string, sub: string, sub2 = '') {
  ctx.fillStyle = 'rgba(6,8,15,0.72)'; ctx.fillRect(0, 0, W, H)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFF1BD'
  ctx.font = 'bold 28px Inter, sans-serif'; ctx.fillText(title, W / 2, H / 2 - 28)
  ctx.font = '17px Inter, sans-serif'; ctx.fillStyle = '#E69E93'; ctx.fillText(sub, W / 2, H / 2 + 12)
  if (sub2) {
    ctx.font = '13px Inter, sans-serif'; ctx.fillStyle = 'rgba(255,241,189,0.52)'
    ctx.fillText(sub2, W / 2, H / 2 + 36)
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
  const gs        = useRef<GS>(initGame())
  const raf       = useRef(0)
  const [ui, setUi] = useState({ score: 0, lives: 3, status: 'idle' as Status, level: 1 })

  const tryShoot = useCallback(() => {
    const s = gs.current
    if (s.status !== 'playing') return
    if (s.fireCooldown > 0 || s.bullets.some(b => b.player)) return
    s.bullets.push({ x: s.playerX, y: PLAYER_Y - PLAYER_H / 2, player: true })
    s.fireCooldown = 22
  }, [])

  const tryRestart = useCallback(() => {
    const s = gs.current
    const lvl = s.status === 'won' ? s.level + 1 : 1
    gs.current = initGame(lvl)
    gs.current.status = 'playing'
    setUi({ score: 0, lives: 3, status: 'playing', level: lvl })
  }, [])

  const handleAction = useCallback(() => {
    const st = gs.current.status
    if (st === 'idle' || st === 'over' || st === 'won') tryRestart()
    else tryShoot()
  }, [tryRestart, tryShoot])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const keys   = new Set<string>()

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const relevant = ['ArrowLeft','ArrowRight','KeyA','KeyD','a','d','A','D',' ','Enter']
      if (relevant.includes(e.code) || relevant.includes(e.key)) e.preventDefault()
      if (e.type === 'keydown') {
        keys.add(e.code); keys.add(e.key)
        if (e.key === ' ' || e.code === 'Space') {
          const st = gs.current.status
          if (st === 'idle' || st === 'over' || st === 'won') tryRestart()
          else tryShoot()
        }
        if (e.key === 'Enter') {
          const st = gs.current.status
          if (st === 'idle' || st === 'over' || st === 'won') tryRestart()
        }
      } else {
        keys.delete(e.code); keys.delete(e.key)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup',   onKey)

    function loop() {
      const s = gs.current
      s.frame++

      // ── Playing ──────────────────────────────────────────────────────────
      if (s.status === 'playing') {
        const goL = keys.has('ArrowLeft')  || keys.has('a') || keys.has('A') || keys.has('KeyA') || s.inputL
        const goR = keys.has('ArrowRight') || keys.has('d') || keys.has('D') || keys.has('KeyD') || s.inputR
        if (goL) s.playerX = Math.max(PLAYER_W / 2, s.playerX - PLAYER_SPEED)
        if (goR) s.playerX = Math.min(W - PLAYER_W / 2, s.playerX + PLAYER_SPEED)
        if (s.fireCooldown > 0) s.fireCooldown--

        for (const b of s.bullets) b.y += b.player ? -PLAYER_BULLET_SPD : ALIEN_BULLET_SPD
        s.bullets = s.bullets.filter(b => b.y > -10 && b.y < H + 10)

        // Fleet movement
        s.moveTimer++
        const alive = s.aliens.filter(a => a.alive)
        const speedBoost = Math.max(0, Math.floor((ALIEN_COLS * ALIEN_ROWS - alive.length) / 6))
        const interval   = Math.max(3, s.moveInterval - speedBoost * 2)
        if (s.moveTimer >= interval) {
          s.moveTimer = 0
          if (alive.length > 0) {
            const maxCol  = Math.max(...alive.map(a => a.col))
            const minCol  = Math.min(...alive.map(a => a.col))
            const rightX  = ALIEN_GRID_LEFT + s.offsetX + maxCol * ALIEN_SLOT_W + ALIEN_SLOT_W
            const leftX   = ALIEN_GRID_LEFT + s.offsetX + minCol * ALIEN_SLOT_W
            if      (s.dirX ===  1 && rightX + ALIEN_STEP_X > W - 8) { s.offsetY += ALIEN_STEP_DOWN; s.dirX = -1 }
            else if (s.dirX === -1 && leftX  - ALIEN_STEP_X < 8)     { s.offsetY += ALIEN_STEP_DOWN; s.dirX =  1 }
            else s.offsetX += s.dirX * ALIEN_STEP_X
          }
        }

        // Alien shoots
        s.fireTimer++
        const fireInterval = Math.max(28, 88 - (s.level - 1) * 8)
        if (s.fireTimer >= fireInterval && alive.length > 0) {
          s.fireTimer = 0
          const shooter = alive[Math.floor(Math.random() * alive.length)]
          s.bullets.push({ x: alienCX(s, shooter.col), y: alienCY(s, shooter.row) + ALIEN_SLOT_H / 2, player: false })
        }

        // Player bullet hits alien
        outer:
        for (let bi = s.bullets.length - 1; bi >= 0; bi--) {
          const b = s.bullets[bi]
          if (!b.player) continue
          for (const al of s.aliens) {
            if (!al.alive) continue
            const ax = alienCX(s, al.col), ay = alienCY(s, al.row)
            if (Math.abs(b.x - ax) < ALIEN_SLOT_W * 0.5 && Math.abs(b.y - ay) < ALIEN_SLOT_H * 0.55) {
              al.alive = false
              s.explosions.push({ x: ax, y: ay, t: 20 })
              s.bullets.splice(bi, 1)
              const pts = al.type === 0 ? 30 : al.type === 1 ? 20 : 10
              s.score += pts
              setUi(u => ({ ...u, score: s.score }))
              continue outer
            }
          }
        }

        // Alien bullet hits player
        for (let bi = s.bullets.length - 1; bi >= 0; bi--) {
          const b = s.bullets[bi]
          if (b.player) continue
          if (Math.abs(b.x - s.playerX) < PLAYER_W * 0.5 && Math.abs(b.y - PLAYER_Y) < PLAYER_H * 0.55) {
            s.bullets.splice(bi, 1)
            s.lives--
            s.explosions.push({ x: s.playerX, y: PLAYER_Y, t: 20 })
            if (s.lives <= 0) { s.status = 'over';  setUi(u => ({ ...u, lives: 0, status: 'over' })) }
            else              { s.status = 'dying'; s.dT = 80; setUi(u => ({ ...u, lives: s.lives, status: 'dying' })) }
            break
          }
        }

        // Aliens reached bottom
        for (const al of s.aliens) {
          if (al.alive && alienCY(s, al.row) >= PLAYER_Y - PLAYER_H) {
            s.status = 'over'; setUi(u => ({ ...u, status: 'over' })); break
          }
        }

        if (s.aliens.every(a => !a.alive)) {
          s.status = 'won'; setUi(u => ({ ...u, score: s.score, status: 'won' }))
        }

        s.explosions = s.explosions.map(ex => ({ ...ex, t: ex.t - 1 })).filter(ex => ex.t > 0)

        // ── Guinness power-up ─────────────────────────────────────────────
        // Spawn at random bottom position
        if (s.powerup === null) {
          s.powerupSpawn--
          if (s.powerupSpawn <= 0) {
            s.powerupSpawn = 360 + Math.floor(Math.random() * 420)
            s.powerup = { x: 60 + Math.random() * (W - 120), y: PLAYER_Y - 22, timer: 300 }
          }
        }
        // Countdown & despawn if not collected in time
        if (s.powerup !== null) {
          s.powerup.timer--
          if (s.powerup.timer <= 0) s.powerup = null
        }
        // Player walks over it to collect
        if (s.powerup !== null && Math.abs(s.playerX - s.powerup.x) < 30) {
          s.explosions.push({ x: s.powerup.x, y: s.powerup.y, t: 20 })
          s.powerup = null
          s.powerupTimer = 300   // 5 seconds at 60 fps
        }
        // Auto rapid-fire while powered up
        if (s.powerupTimer > 0) {
          s.powerupTimer--
          if (s.frame % 8 === 0) {
            s.bullets.push({ x: s.playerX, y: PLAYER_Y - PLAYER_H / 2, player: true })
          }
        }
      }

      // ── Dying ─────────────────────────────────────────────────────────────
      if (s.status === 'dying') {
        s.dT--
        if (s.dT <= 0) {
          s.playerX = W / 2
          s.bullets  = []
          s.status   = 'playing'
          setUi(u => ({ ...u, status: 'playing' }))
        }
      }

      // ── Render ────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H)
      drawBg(ctx, s.frame)
      if (s.powerup !== null) drawGuinness(ctx, s.powerup.x, s.powerup.y, s.frame)
      for (const al of s.aliens)     if (al.alive) drawAlien(ctx, alienCX(s, al.col), alienCY(s, al.row), al.type, s.frame)
      for (const b  of s.bullets)    drawBullet(ctx, b)
      for (const ex of s.explosions) drawExplosion(ctx, ex)
      drawPlayer(ctx, s.playerX, s.status === 'dying', s.frame)

      // Power-up timer bar
      if (s.powerupTimer > 0) {
        const frac = s.powerupTimer / 300
        const bw = 120
        const bx = W / 2 - bw / 2
        const by = H - 14
        ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(bx - 1, by - 1, bw + 2, 8)
        const barGrd = ctx.createLinearGradient(bx, 0, bx + bw, 0)
        barGrd.addColorStop(0, '#c8901a'); barGrd.addColorStop(1, '#f5c842')
        ctx.fillStyle = barGrd; ctx.fillRect(bx, by, bw * frac, 6)
        ctx.font = '9px Inter, sans-serif'; ctx.fillStyle = '#FFF1BD'
        ctx.textAlign = 'center'; ctx.fillText('🍺 RAPID FIRE', W / 2, by - 3)
      }

      if (s.status === 'idle')  drawOverlay(ctx, 'Space Invaders', 'Arrow keys to move  ·  Space to shoot', 'Defend the wedding from the alien invasion!')
      if (s.status === 'over')  drawOverlay(ctx, 'Game Over', `Score: ${s.score}`, 'Press Space or Enter to try again')
      if (s.status === 'won')   drawOverlay(ctx, 'Wave Cleared!', `Score: ${s.score} — Next wave incoming!`, 'Press Space or Enter to continue')

      raf.current = requestAnimationFrame(loop)
    }

    raf.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup',   onKey)
    }
  }, [tryShoot, tryRestart])

  return (
    <section id="game" style={{ backgroundColor: '#06080f', padding: 'clamp(4rem,8vw,6rem) 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Pre-wedding entertainment
          </p>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#FFF1BD', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, margin: '0 0 0.5rem' }}>
            Space Invaders
          </h2>
          <p style={{ color: '#FFF1BD', opacity: 0.5, fontSize: '0.82rem', letterSpacing: '0.04em' }}>
            Arrow keys to move &nbsp;·&nbsp; Space to shoot &nbsp;·&nbsp; Defend the wedding!
          </p>
        </div>

        {/* HUD */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          maxWidth: W, margin: '0 auto 0.6rem',
          color: '#FFF1BD', fontSize: '0.88rem', letterSpacing: '0.05em',
        }}>
          <span>Score: <strong style={{ color: '#E78D5A' }}>{ui.score}</strong></span>
          <span>Wave: <strong style={{ color: '#908A32' }}>{ui.level}</strong></span>
          <span>
            Lives:&nbsp;
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

        {/* Mobile controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
          <button
            style={btnStyle}
            onPointerDown={() => { gs.current.inputL = true }}
            onPointerUp={() => { gs.current.inputL = false }}
            onPointerLeave={() => { gs.current.inputL = false }}
            onPointerCancel={() => { gs.current.inputL = false }}
          >◀</button>
          <button
            style={{ ...btnStyle, width: 72, background: 'rgba(80,200,120,0.18)', border: '1px solid rgba(80,200,120,0.4)' }}
            onPointerDown={handleAction}
          >🚀</button>
          <button
            style={btnStyle}
            onPointerDown={() => { gs.current.inputR = true }}
            onPointerUp={() => { gs.current.inputR = false }}
            onPointerLeave={() => { gs.current.inputR = false }}
            onPointerCancel={() => { gs.current.inputR = false }}
          >▶</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => { gs.current = initGame(1); gs.current.status = 'playing'; setUi({ score: 0, lives: 3, status: 'playing', level: 1 }) }}
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
