export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1E4035', borderTop: '1px solid rgba(255,241,189,0.15)' }} className="text-center py-10 px-6">
      <p style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: '1.4rem', letterSpacing: '0.05em' }}>
        Connie &amp; Adrian
      </p>
      <p style={{ color: '#FFF1BD', opacity: 0.6, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
        19 June 2027 &nbsp;·&nbsp; Achill Island, Co. Mayo
      </p>
      <p style={{ color: '#FFF1BD', opacity: 0.35, fontSize: '0.7rem', marginTop: '1.5rem', letterSpacing: '0.05em' }}>
        Made with love
      </p>
    </footer>
  )
}
