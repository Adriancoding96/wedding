import { useLanguage } from '../../utils/LanguageContext'
import { translations } from '../../utils/translations'

export default function FAQ() {
  const { lang } = useLanguage()
  const t = translations[lang].faq
  return (
    <section id="faq" style={{ backgroundColor: '#FFF1BD', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-script)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: '0 0 1.5rem' }}>{t.heading}</h2>
        <p style={{ color: '#1E4035', opacity: 0.75, lineHeight: 1.8, maxWidth: 560, margin: '0 auto', fontSize: '1rem' }}>{t.body}</p>
      </div>
    </section>
  )
}
