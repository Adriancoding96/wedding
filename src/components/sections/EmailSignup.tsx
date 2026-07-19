import { useState } from 'react'
import type { FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL as string

export default function EmailSignup() {
  const [status, setStatus] = useState<Status>('idle')
  const [email, setEmail] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="updates" style={{ backgroundColor: '#E69E93', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#1E4035', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7 }}>Stay in the loop</p>
        <h2 style={{ fontFamily: 'var(--font-script)', color: '#1E4035', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: '0 0 0.75rem' }}>
          Stay Updated
        </h2>
        <p style={{ color: '#1E4035', opacity: 0.75, lineHeight: 1.7, marginBottom: '2rem' }}>
          Sign up to receive updates about our big day — from venue details to last-minute news.
        </p>

        {status === 'success' ? (
          <p style={{ color: '#1E4035', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic' }}>
            Thank you! We'll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: '1 1 220px',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(30,64,53,0.3)',
                backgroundColor: 'rgba(255,255,255,0.5)',
                color: '#1E4035',
                fontSize: '0.9rem',
                borderRadius: '2px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: '#780918',
                color: '#FFF1BD',
                border: 'none',
                borderRadius: '2px',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                opacity: status === 'submitting' ? 0.7 : 1,
              }}
            >
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
            </button>
            {status === 'error' && (
              <p style={{ width: '100%', color: '#780918', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                Something went wrong — please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
