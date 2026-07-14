const GALLERY_COUNT = 8

export default function Gallery() {
  return (
    <section id="gallery" style={{ backgroundColor: '#1E4035', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Photos</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, margin: 0 }}>Gallery</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: GALLERY_COUNT }, (_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '4 / 3',
                backgroundColor: '#0e2620',
                border: '1px solid rgba(255,241,189,0.1)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
                overflow: 'hidden',
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
              <div style={{ textAlign: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFF1BD" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25, margin: '0 auto' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{ color: '#FFF1BD', opacity: 0.25, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.6rem' }}>
                  Photo {i + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
