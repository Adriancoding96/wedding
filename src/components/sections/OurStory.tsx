import { useLanguage } from '../../utils/LanguageContext'
import { translations } from '../../utils/translations'

export default function OurStory() {
  const { lang } = useLanguage()
  const t = translations[lang].ourStory
  return (
    <section id="our-story" style={{ backgroundColor: '#FFF1BD', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        {/* Photo */}
        <div style={{
          aspectRatio: '1 / 1',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <img
            src={`${import.meta.env.BASE_URL}images/our-story.jpeg`}
            alt="Connie and Adrian"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>

        {/* Text */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, margin: '0 0 1.5rem' }}>
            {t.heading}
          </h2>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, marginBottom: '1rem' }}>
            {t.p1}
          </p>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, marginBottom: '1rem' }}>
            {t.p2}
          </p>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8 }}>
            {t.p3}
          </p>
        </div>
      </div>
    </section>
  )
}
