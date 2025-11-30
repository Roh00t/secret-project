// apps/web/pages/venues/index.tsx
import { useEffect } from 'react'
import Link from 'next/link'
import { venueService } from '../../lib/services/venueService'
import { useVenueStore } from '../../lib/stores/venueStore'
import { supabase } from '../../lib/supabase'

export default function VenuesPage() {
  const { venues, setVenues, loading, setLoading } = useVenueStore()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await venueService.getAllVenues()
        setVenues(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()

    // subscribe to realtime changes on venues and refresh list when events happen
    const channel = supabase
      .channel('public:venues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'venues' }, (payload) => {
        console.debug('venues realtime payload', payload)
        // simple approach: re-load the full list
        load()
      })
      .subscribe()

    return () => {
      try {
        channel.unsubscribe()
      } catch (e) {
        // ignore
      }
    }
  }, [setVenues, setLoading])

  if (loading) return <div>Loading venues…</div>
  return (
    <main style={{ padding: 20 }}>
      <h1>Venues</h1>
      <ul>
        {venues.map(v => (
          <li key={v.id}>
            <Link href={`/venues/${v.id}`}>
              {v.name} — {v.status}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}