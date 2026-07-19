import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../utils/LanguageContext'
import { translations } from '../utils/translations'

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang } = useLanguage()
  const t = translations[lang].navbar

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
        <ul className="hidden nav:flex items-center gap-8">
          {t.links.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                style={{ color: '#FFF1BD', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop right: guest login */}
        <div className="hidden nav:flex items-center gap-3">
          <Link
            to="/guest"
            className="transition-colors"
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
            {t.guestLogin}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav:hidden flex flex-col gap-1.5 p-2"
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
        <div style={{ backgroundColor: '#1E4035', borderTop: '1px solid rgba(255,241,189,0.15)' }} className="nav:hidden px-6 pb-4 pt-2 flex flex-col gap-4">
          {t.links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { scrollToSection(id); setMenuOpen(false) }}
              style={{ color: '#FFF1BD', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
            >
              {label}
            </button>
          ))}
          <Link
            to="/guest"
            onClick={() => setMenuOpen(false)}
            style={{ color: '#FFF1BD', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {t.guestLogin}
          </Link>
        </div>
      )}
    </nav>
  )
}
