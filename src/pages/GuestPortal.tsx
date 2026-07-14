import { Navigate } from 'react-router-dom'
import { isUnlocked } from '../utils/guestAuth'
import { useState } from 'react'
import type { FormEvent } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type Status = 'idle' | 'submitting' | 'success' | 'error'

function RSVPForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID_RSVP', {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,241,189,0.08)',
    border: '1px solid rgba(255,241,189,0.25)',
    borderRadius: '2px',
    color: '#FFF1BD',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: '1.4rem', fontStyle: 'italic' }}>
          We've received your RSVP — thank you! 🎉
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 520 }}>
      <div>
        <label style={{ color: '#FFF1BD', opacity: 0.7, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
        <input type="text" name="name" required style={inputStyle} />
      </div>
      <div>
        <label style={{ color: '#FFF1BD', opacity: 0.7, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Email Address *</label>
        <input type="email" name="email" required style={inputStyle} />
      </div>
      <div>
        <label style={{ color: '#FFF1BD', opacity: 0.7, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>Will you be attending? *</label>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Yes, I\'ll be there! 🎉', 'Sadly can\'t make it'].map((label, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#FFF1BD', fontSize: '0.9rem' }}>
              <input type="radio" name="attending" value={i === 0 ? 'yes' : 'no'} required style={{ accentColor: '#780918' }} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label style={{ color: '#FFF1BD', opacity: 0.7, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Dietary Requirements</label>
        <textarea name="dietary" rows={3} placeholder="Any allergies or dietary needs?" style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label style={{ color: '#FFF1BD', opacity: 0.7, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>🎵 Song Request</label>
        <input type="text" name="song" placeholder="What song will get you on the dance floor?" style={inputStyle} />
      </div>
      {status === 'error' && (
        <p style={{ color: '#E78D5A', fontSize: '0.85rem', margin: 0 }}>Something went wrong — please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          padding: '0.85rem 2rem',
          backgroundColor: '#780918',
          color: '#FFF1BD',
          border: 'none',
          borderRadius: '2px',
          fontSize: '0.8rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: status === 'submitting' ? 'wait' : 'pointer',
          opacity: status === 'submitting' ? 0.7 : 1,
          alignSelf: 'flex-start',
        }}
      >
        {status === 'submitting' ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}

const sectionStyle: React.CSSProperties = { marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,241,189,0.15)' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: '1.6rem', fontWeight: 300, margin: '0 0 1.25rem' }
const bodyStyle: React.CSSProperties = { color: '#FFF1BD', opacity: 0.75, lineHeight: 1.8, fontSize: '0.95rem', margin: '0 0 0.5rem' }

export default function GuestPortal() {
  if (!isUnlocked()) return <Navigate to="/guest" replace />

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: '#1E4035', minHeight: '100svh', paddingTop: '5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ width: 40, height: 1, backgroundColor: '#FFF1BD', opacity: 0.4, margin: '0 auto 1.5rem' }} />
            <p style={{ color: '#908A32', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Welcome</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, margin: 0 }}>
              Guest Portal
            </h1>
            <div style={{ width: 40, height: 1, backgroundColor: '#FFF1BD', opacity: 0.4, margin: '1.5rem auto 0' }} />
          </div>

          {/* Venue */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Venue &amp; Address</h2>
            <p style={bodyStyle}><strong style={{ color: '#FFF1BD' }}>Venue Name</strong> — To be confirmed</p>
            <p style={bodyStyle}>Full address, Achill Island, Co. Mayo, Ireland</p>
            <p style={bodyStyle}>Eircode: F28 XXXX (placeholder)</p>
            <p style={bodyStyle}>Directions: Follow signs from Achill Sound village — more details to follow.</p>
          </div>

          {/* Getting There */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Getting There</h2>
            <p style={bodyStyle}>
              <strong style={{ color: '#FFF1BD' }}>By Car:</strong> From Dublin, take the M6/N17 towards Castlebar, then the N59 to Westport and on to Achill Island via Achill Sound. Allow approximately 3.5 hours.
            </p>
            <p style={bodyStyle}>
              <strong style={{ color: '#FFF1BD' }}>From Knock Airport:</strong> Take the N17 south to Tuam, then connect to the N84 / N59 towards Castlebar and Achill. Allow approximately 1 hour.
            </p>
            <p style={bodyStyle}>
              <strong style={{ color: '#FFF1BD' }}>Parking:</strong> Ample parking available at the venue — details to follow.
            </p>
          </div>

          {/* Accommodation */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Accommodation</h2>
            <p style={{ ...bodyStyle, marginBottom: '1.25rem' }}>
              Achill Island has a wonderful range of places to stay. We recommend booking early — summer is busy! Here are a few options to get you started:
            </p>
            {[
              { name: 'Achill Cliff House Hotel', note: 'Clifftop views, Keel village' },
              { name: 'Gray\'s Guesthouse', note: 'Dugort village, family-run, charming' },
              { name: 'Self-catering cottages', note: 'Available via AirBnB, Booking.com etc.' },
              { name: 'Wild Atlantic Lodge', note: 'Placeholder — confirm closer to date' },
            ].map(({ name, note }) => (
              <div key={name} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ color: '#908A32', marginTop: 3 }}>—</span>
                <div>
                  <span style={{ color: '#FFF1BD', fontSize: '0.95rem' }}>{name}</span>
                  <span style={{ color: '#FFF1BD', opacity: 0.5, fontSize: '0.85rem' }}> · {note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* RSVP */}
          <div>
            <h2 style={headingStyle}>RSVP</h2>
            <p style={{ ...bodyStyle, marginBottom: '1.75rem' }}>
              Please let us know if you'll be joining us by <strong style={{ color: '#FFF1BD' }}>1 May 2027</strong>. We can't wait to celebrate with you!
            </p>
            <RSVPForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
