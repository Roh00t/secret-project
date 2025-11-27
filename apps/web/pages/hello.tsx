import React, { useEffect, useState } from 'react'

export default function HelloPage() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHello() {
      try {
        const res = await fetch('http://localhost:4000/api/hello')
        const data = await res.json()
        setMessage(data?.message ?? 'no message')
      } catch (err) {
        setMessage('fetch error')
      }
    }
    fetchHello()
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h1>SafeOps — Frontend Hello</h1>
      <p>API message: <strong>{message ?? 'loading...'}</strong></p>
    </main>
  )
}