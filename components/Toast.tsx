'use client'

export default function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--card2)', border: '1px solid var(--rim2)',
      padding: '12px 24px', borderRadius: 10,
      fontSize: 13, color: 'var(--snow)', whiteSpace: 'nowrap',
      zIndex: 9999, animation: 'fadeUp .3s ease',
    }}>
      {message}
    </div>
  )
}
