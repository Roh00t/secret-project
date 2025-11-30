import { create } from 'zustand'

export interface Venue {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  status: 'safe' | 'warning' | 'critical' | 'restricted'
  critical_issues_count: number
  created_at: string
}

export interface VenueHazard {
  id: string
  venue_id: string
  hazard_category: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  likelihood: 'low' | 'medium' | 'high' | 'very_high'
  rpn: number
  status: 'open' | 'resolved' | 'pending'
}

interface VenueStore {
  venues: Venue[]
  selectedVenue: Venue | null
  venueHazards: VenueHazard[]
  loading: boolean
  setVenues: (venues: Venue[]) => void
  setSelectedVenue: (venue: Venue | null) => void
  setVenueHazards: (hazards: VenueHazard[]) => void
  setLoading: (loading: boolean) => void
  addVenue: (venue: Venue) => void
}

export const useVenueStore = create<VenueStore>((set) => ({
  venues: [],
  selectedVenue: null,
  venueHazards: [],
  loading: false,
  setVenues: (venues) => set({ venues }),
  setSelectedVenue: (venue) => set({ selectedVenue: venue }),
  setVenueHazards: (hazards) => set({ venueHazards: hazards }),
  setLoading: (loading) => set({ loading }),
  addVenue: (venue) => set((state) => ({ venues: [venue, ...state.venues] })),
}))
