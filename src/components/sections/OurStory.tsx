export default function OurStory() {
  return (
    <section id="our-story" style={{ backgroundColor: '#FFF1BD', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        {/* Photo placeholder */}
        <div style={{
          aspectRatio: '1 / 1',
          backgroundColor: '#1E4035',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '2px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFF1BD" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, margin: '0 auto' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={{ color: '#FFF1BD', opacity: 0.4, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.75rem' }}>Photo coming soon</p>
          </div>
        </div>

        {/* Text */}
        <div>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Story</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.2, margin: '0 0 1.5rem' }}>
            How it all began
          </h2>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, marginBottom: '1rem' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, marginBottom: '1rem' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8 }}>
            Sunt in culpa qui officia deserunt mollit anim id est laborum. And so the adventure continues — all the way to Achill Island.
          </p>
        </div>
      </div>
    </section>
  )
}
