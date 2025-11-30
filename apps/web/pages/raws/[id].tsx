// apps/web/pages/raws/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { rawService } from '../../lib/services/rawService'

export default function RAWDetail() {
  const { query } = useRouter()
  const id = query.id as string
  const [raw, setRaw] = useState(null)
  useEffect(() => {
    if (!id) return
    const load = async () => {
      const data = await rawService.getRAWById(id)
      setRaw(data)
    }
    load()
  }, [id])

  if (!raw) return <div>Loading RAW…</div>
  return (
    <main style={{ padding: 20 }}>
      <h1>{raw.event_title || 'RAW detail'}</h1>
      <p>Status: {raw.status}</p>
      <h2>Hazards</h2>
      <ul>
        {(raw.hazards || []).map(h => (
          <li key={h.id}>{h.hazard_description} — {h.rpn}</li>
        ))}
      </ul>
    </main>
  )
}