import { useLanguage } from '../../utils/LanguageContext'
import { translations } from '../../utils/translations'

export default function Location() {
  const { lang } = useLanguage()
  const t = translations[lang].location
  return (
    <section id="location" style={{ backgroundColor: '#FFF1BD', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: '0 0 1.5rem' }}>
            {t.heading}
          </h2>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, maxWidth: 620, margin: '0 auto 0.75rem' }}>
            {t.p1}
          </p>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
            {t.p2}
          </p>
        </div>

        {/* Map */}
        <div style={{ borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(30,64,53,0.15)', marginBottom: '3rem' }}>
          <iframe
            title="Achill Island, County Mayo"
            src="https://maps.google.com/maps?q=Achill+Island,+County+Mayo,+Ireland&output=embed"
            width="100%"
            height="400"
            loading="lazy"
            style={{ display: 'block', border: 'none' }}
          />
        </div>

        {/* Travel tips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {t.tips.map(({ title, body }) => (
            <div key={title} style={{ padding: '1.5rem', backgroundColor: 'rgba(30,64,53,0.06)', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#1E4035', fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem' }}>{title}</h3>
              <p style={{ color: '#1E4035', opacity: 0.75, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
