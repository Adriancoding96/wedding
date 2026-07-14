export default function OurStory() {
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
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Story</p>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, margin: '0 0 1.5rem' }}>
            We are getting married
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
