// apps/web/pages/venues/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { venueService } from '../../lib/services/venueService'

export default function VenueDetail() {
  const router = useRouter()
  const { id } = router.query
  const [venue, setVenue] = useState(null)
  const [hazards, setHazards] = useState([])
  useEffect(() => {
    if (!id) return
    const load = async () => {
      const v = await venueService.getVenueById(id as string)
      setVenue(v)
      const h = await venueService.getVenueHazards(id as string)
      setHazards(h)
    }
    load()
  }, [id])

  if (!venue) return <div>Loading venue…</div>
  return (
    <main style={{ padding: 20 }}>
      <h1>{venue.name}</h1>
      <p>{venue.address}</p>
      <h2>Hazards</h2>
      <ul>
        {hazards.map(h => (
          <li key={h.id}>{h.hazard_category} — {h.rpn} (status: {h.status})</li>
        ))}
      </ul>
    </main>
  )
}