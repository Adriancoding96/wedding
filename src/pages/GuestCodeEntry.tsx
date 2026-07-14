import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateCode, setUnlocked, isUnlocked } from '../utils/guestAuth'

export default function GuestCodeEntry() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isUnlocked()) navigate('/guest/portal', { replace: true })
  }, [navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const valid = await validateCode(code)
    setLoading(false)
    if (valid) {
      setUnlocked()
      navigate('/guest/portal')
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div style={{ minHeight: '100svh', backgroundColor: '#1E4035', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'rgba(255,241,189,0.06)',
          border: '1px solid rgba(255,241,189,0.2)',
          borderRadius: '4px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}
      >
        {/* Thin line */}
        <div style={{ width: 40, height: 1, backgroundColor: '#FFF1BD', opacity: 0.4, margin: '0 auto 1.5rem' }} />

        <h1 style={{ fontFamily: 'var(--font-serif)', color: '#FFF1BD', fontSize: '1.8rem', fontWeight: 300, margin: '0 0 0.75rem' }}>
          Guest Access
        </h1>
        <p style={{ color: '#FFF1BD', opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 2rem' }}>
          You've received a special code. Enter it below to access additional details about the day.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={code}
              onChange={e => { setCode(e.target.value); setError(false) }}
              placeholder="Enter your code"
              required
              style={{
                width: '100%',
                padding: '0.8rem 3rem 0.8rem 1rem',
                backgroundColor: 'rgba(255,241,189,0.08)',
                border: `1px solid ${error ? '#E78D5A' : 'rgba(255,241,189,0.25)'}`,
                borderRadius: '2px',
                color: '#FFF1BD',
                fontSize: '1rem',
                textAlign: 'center',
                letterSpacing: '0.15em',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#FFF1BD', opacity: 0.5, padding: 0, fontSize: '0.8rem' }}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p style={{ color: '#E78D5A', fontSize: '0.85rem', margin: 0 }}>
              Invalid code — please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            style={{
              padding: '0.85rem',
              backgroundColor: '#780918',
              color: '#FFF1BD',
              border: 'none',
              borderRadius: '2px',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !code.trim() ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <div style={{ width: 40, height: 1, backgroundColor: '#FFF1BD', opacity: 0.4, margin: '2rem auto 0' }} />
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0) }
          20%      { transform: translateX(-8px) }
          40%      { transform: translateX(8px) }
          60%      { transform: translateX(-5px) }
          80%      { transform: translateX(5px) }
        }
      `}</style>
    </div>
  )
}
