const FAQS = [
  {
    q: 'Is there accommodation on Achill Island?',
    a: 'Yes! There is a great selection of hotels, B&Bs and self-catering properties on the island. We recommend booking early as summer on Achill is popular. More specific recommendations are available in the Guest Portal.',
  },
  {
    q: 'How do I get to Achill Island?',
    a: 'The island is connected to the mainland by the Michael Davitt Bridge at Achill Sound. Ireland West Airport Knock (NOC) is the nearest airport (approx. 1 hour by car). Dublin Airport (DUB) is approx. 3.5 hours. Westport is the closest town with train connections.',
  },
  {
    q: 'What is the dress code?',
    a: 'Smart / elegant. We\'d love for you to embrace the earthy, natural tones of the island — but most importantly, wear something you feel great in.',
  },
  {
    q: 'Will there be transport provided?',
    a: 'Details on any transport arrangements will be shared in the Guest Portal closer to the day. Keep an eye on your inbox for updates.',
  },
  {
    q: 'Who do I contact with questions?',
    a: 'Please sign up for updates below and we\'ll be in touch with all the details. For urgent questions, reach out to us directly.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" style={{ backgroundColor: '#FFF1BD', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Got Questions?</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, margin: 0 }}>FAQ</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              style={{ borderBottom: '1px solid rgba(30,64,53,0.15)' }}
            >
              <summary style={{
                cursor: 'pointer',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.1rem 0',
                fontFamily: 'var(--font-serif)',
                color: '#1E4035',
                fontSize: '1.1rem',
                userSelect: 'none',
              }}>
                {q}
                <span style={{ color: '#780918', fontSize: '1.2rem', lineHeight: 1, marginLeft: '1rem', flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ color: '#1E4035', opacity: 0.75, lineHeight: 1.8, padding: '0 0 1.2rem', margin: 0, fontSize: '0.95rem' }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
