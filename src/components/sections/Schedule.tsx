import { useLanguage } from '../../utils/LanguageContext'
import { translations } from '../../utils/translations'

export default function Schedule() {
  const { lang } = useLanguage()
  const t = translations[lang].schedule
  return (
    <section id="schedule" style={{ backgroundColor: '#1E4035', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#FFF1BD', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0 }}>{t.heading}</h2>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Blurred timeline */}
          <div style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none', paddingLeft: '2.5rem' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '0.45rem', top: 8, bottom: 8, width: 1, backgroundColor: 'rgba(144,138,50,0.4)' }} />

            {t.timeline.map(({ time, event, desc }, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: i < t.timeline.length - 1 ? '2.5rem' : 0 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '0.3rem',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#780918',
                  border: '2px solid #FFF1BD',
                  boxSizing: 'border-box',
                }} />
                <p style={{ color: '#908A32', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>{time}</p>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: '1.3rem', fontWeight: 400, margin: '0 0 0.35rem' }}>{event}</h3>
                <p style={{ color: '#FFF1BD', opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* TBA overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
          }}>
            <p style={{ color: '#908A32', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>
              {t.comingSoon}
            </p>
            <p style={{ fontFamily: 'var(--font-script)', color: '#FFF1BD', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, margin: 0 }}>
              {t.tba}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
