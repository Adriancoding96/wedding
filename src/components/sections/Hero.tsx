import { useCountdown } from '../../utils/countdown'

function Pad({ n }: { n: number }) {
  return <>{String(n).padStart(2, '0')}</>
}

export default function Hero() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown()

  return (
    <section
      id="hero"
      style={{ minHeight: '100svh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Background placeholder */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0e2620' }} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1E4035', opacity: 0.75 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem 1.5rem', maxWidth: 680 }}>
        {/* Thin decorative line */}
        <div style={{ width: 60, height: 1, backgroundColor: '#FFF1BD', opacity: 0.5, margin: '0 auto 2rem' }} />

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          color: '#FFF1BD',
          fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
          fontWeight: 300,
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          margin: '0 0 1rem',
        }}>
          Connie &amp; Adrian
        </h1>

        <p style={{ color: '#FFF1BD', opacity: 0.85, fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          19 &middot; June &middot; 2027
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', opacity: 0.7, fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '3rem' }}>
          Achill Island, County Mayo, Ireland
        </p>

        {/* Countdown */}
        {!isExpired ? (
          <div style={{ display: 'flex', gap: 'clamp(1rem, 4vw, 2.5rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ value: days, label: 'Days' }, { value: hours, label: 'Hours' }, { value: minutes, label: 'Mins' }, { value: seconds, label: 'Secs' }].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: 56 }}>
                <div style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1 }}>
                  <Pad n={value} />
                </div>
                <div style={{ color: '#FFF1BD', opacity: 0.5, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: '1.4rem', fontStyle: 'italic' }}>
            Today's the day! 🎉
          </p>
        )}

        <div style={{ width: 60, height: 1, backgroundColor: '#FFF1BD', opacity: 0.5, margin: '2.5rem auto 0' }} />
      </div>

      {/* Scroll chevron */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF1BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, animation: 'bounce 2s infinite' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }`}</style>
    </section>
  )
}
