import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { href: '#our-story', label: 'Our Story' },
  { href: '#gallery',   label: 'Gallery' },
  { href: '#location',  label: 'Location' },
  { href: '#schedule',  label: 'Schedule' },
  { href: '#faq',       label: 'FAQ' },
  { href: '#updates',   label: 'Updates' },
  { href: '#game',      label: 'Game' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? '#1E4035' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,241,189,0.15)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <span style={{ fontFamily: 'var(--font-script)', color: '#FFF1BD', fontSize: '1.5rem', letterSpacing: '0.02em' }}>
          C &amp; A
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                style={{ color: '#FFF1BD', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Guest login */}
        <Link
          to="/guest"
          className="hidden md:inline-block transition-colors"
          style={{
            border: '1px solid #FFF1BD',
            color: '#FFF1BD',
            padding: '0.35rem 1rem',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderRadius: '2px',
          }}
        >
          Guest Login
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: '#FFF1BD', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(2px, 4px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: '#FFF1BD', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: '#FFF1BD', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(2px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#1E4035', borderTop: '1px solid rgba(255,241,189,0.15)' }} className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ color: '#FFF1BD', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {label}
            </a>
          ))}
          <Link
            to="/guest"
            onClick={() => setMenuOpen(false)}
            style={{ color: '#FFF1BD', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Guest Login
          </Link>
        </div>
      )}
    </nav>
  )
}
