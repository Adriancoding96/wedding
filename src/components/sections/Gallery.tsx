import { useLanguage } from '../../utils/LanguageContext'
import { translations } from '../../utils/translations'

const GALLERY_COUNT = 9
const REAL_PHOTOS = 9

export default function Gallery() {
  const { lang } = useLanguage()
  const t = translations[lang].gallery
  return (
    <section id="gallery" style={{ backgroundColor: '#1E4035', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#FFF1BD', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0 }}>{t.heading}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: GALLERY_COUNT }, (_, i) => {
            const isReal = i < REAL_PHOTOS
            return (
              <div
                key={i}
                style={{
                  aspectRatio: '4 / 3',
                  backgroundColor: '#0e2620',
                  border: '1px solid rgba(255,241,189,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,241,189,0.5)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,241,189,0.1)'
                }}
              >
                {isReal ? (
                  <img
                    src={`${import.meta.env.BASE_URL}images/gallery/photo-${i + 1}.jpeg`}
                    alt={`Connie and Adrian — photo ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFF1BD" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25, margin: '0 auto' }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p style={{ color: '#FFF1BD', opacity: 0.25, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.6rem' }}>
                      More soon
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
