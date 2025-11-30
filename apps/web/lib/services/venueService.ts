import { supabase } from '../supabase'
import type { Venue, VenueHazard } from '../stores/venueStore'

export const venueService = {
  async getAllVenues(): Promise<Venue[]> {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return (data || []) as Venue[]
  },

  async searchVenues(query: string): Promise<Venue[]> {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%,postal_code.ilike.%${query}%`)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return (data || []) as Venue[]
  },

  async getVenueById(id: string): Promise<Venue | null> {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching venue:', error)
      return null
    }
    return data as Venue
  },

  async getVenueHazards(venueId: string): Promise<VenueHazard[]> {
    const { data, error } = await supabase
      .from('venue_hazards')
      .select('*')
      .eq('venue_id', venueId)
      .order('rpn', { ascending: false })

    if (error) throw error
    return (data || []) as VenueHazard[]
  },

  async createVenue(venue: Omit<Venue, 'id' | 'created_at'>): Promise<Venue> {
    const { data, error } = await supabase
      .from('venues')
      .insert([venue])
      .select()
      .single()

    if (error) throw error
    return data as Venue
  },

  async updateVenue(id: string, updates: Partial<Venue>): Promise<Venue> {
    const { data, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Venue
  },

  async addHazardToVenue(hazard: Omit<VenueHazard, 'id'>): Promise<VenueHazard> {
    const { data, error } = await supabase
      .from('venue_hazards')
      .insert([hazard])
      .select()
      .single()

    if (error) throw error
    return data as VenueHazard
  },
}
