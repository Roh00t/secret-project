// apps/web/pages/raws/index.tsx
import { useEffect } from 'react'
import Link from 'next/link'
import { rawService } from '../../lib/services/rawService'
import { useRAWStore } from '../../lib/stores/rawStore'
import { useAuthStore } from '../../lib/stores/authStore'

export default function RAWsPage() {
  const { raws, setRAWs, loading, setLoading } = useRAWStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await rawService.getAllRAWs(user?.id)
        setRAWs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [setRAWs, setLoading, user])

  if (loading) return <div>Loading RAWs…</div>
  return (
    <main style={{ padding: 20 }}>
      <h1>RAWs</h1>
      <ul>
        {raws.map(r => (
          <li key={r.id}>
            <Link href={`/raws/${r.id}`}>
              {r.event_title || 'RAW'} — {r.status}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}