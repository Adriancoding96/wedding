const TIMELINE = [
  { time: '2:00 PM', event: 'Guests Arrive',       desc: 'Welcome drinks and a chance to soak in the surroundings.' },
  { time: '3:00 PM', event: 'Ceremony',             desc: 'The moment we\'ve been waiting for.' },
  { time: '4:30 PM', event: 'Drinks Reception',     desc: 'Champagne, canapés and golden-hour views.' },
  { time: '7:00 PM', event: 'Dinner',               desc: 'A sit-down celebration dinner with family and friends.' },
  { time: '9:00 PM', event: 'Dancing',              desc: 'The night is young — let\'s dance until we can\'t anymore.' },
]

export default function Schedule() {
  return (
    <section id="schedule" style={{ backgroundColor: '#1E4035', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>19 June 2027</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, margin: 0 }}>The Day</h2>
        </div>

        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '0.45rem', top: 8, bottom: 8, width: 1, backgroundColor: 'rgba(144,138,50,0.4)' }} />

          {TIMELINE.map(({ time, event, desc }, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i < TIMELINE.length - 1 ? '2.5rem' : 0 }}>
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
      </div>
    </section>
  )
}
