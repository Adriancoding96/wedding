export default function Location() {
  return (
    <section id="location" style={{ backgroundColor: '#FFF1BD', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Where We're Saying I Do</p>
          <h2 style={{ fontFamily: 'var(--font-script)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: '0 0 1.5rem' }}>
            Achill Island, Co. Mayo
          </h2>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, maxWidth: 620, margin: '0 auto 0.75rem' }}>
            Achill Island is Ireland's largest island — a wild, windswept stretch of the Wild Atlantic Way, fringed by golden beaches, dramatic sea cliffs, and the towering slopes of Croaghaun and Slievemore. It's a place of breathtaking beauty and rugged romance.
          </p>
          <p style={{ color: '#1E4035', opacity: 0.8, lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
            We can't think of a more fitting backdrop for the beginning of our greatest adventure together.
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
          {[
            {
              title: 'Getting Here',
              body: 'Ireland West Airport Knock (NOC) is the closest airport — approx. 1 hour by car. Dublin Airport (DUB) is about 3.5 hours.',
            },
            {
              title: 'By Car',
              body: 'Achill is connected to the mainland via the Michael Davitt Bridge at Achill Sound. Follow signs from Westport or Castlebar on the N59.',
            },
            {
              title: 'Staying Over',
              body: 'There is a great selection of hotels, B&Bs, and self-catering on Achill Island. We recommend booking early — more details in your Guest Portal.',
            },
          ].map(({ title, body }) => (
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
