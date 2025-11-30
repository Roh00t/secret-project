import { supabase } from '../supabase'
import type { RAW, RAWHazard } from '../stores/rawStore'

export const rawService = {
  async getAllRAWs(userId?: string): Promise<RAW[]> {
    let query = supabase.from('raw_submissions').select(`
      *,
      venues (name)
    `)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) throw error

    return (data || []).map((raw: any) => ({
      ...raw,
      venue_name: raw.venues?.name,
    })) as RAW[]
  },

  async getRAWById(id: string): Promise<RAW | null> {
    const { data, error } = await supabase
      .from('raw_submissions')
      .select(`
        *,
        venues (name),
        raw_hazards (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching RAW:', error)
      return null
    }

    return {
      ...data,
      venue_name: data.venues?.name,
      hazards: data.raw_hazards || [],
    } as RAW
  },

  async createRAW(raw: Omit<RAW, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>): Promise<RAW> {
    const { data, error } = await supabase
      .from('raw_submissions')
      .insert([
        {
          user_id: raw.user_id,
          venue_id: raw.venue_id,
          status: raw.status || 'draft',
          risk_level: raw.risk_level || 'medium',
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data as RAW
  },

  async updateRAW(id: string, updates: Partial<RAW>): Promise<RAW> {
    const { data, error } = await supabase
      .from('raw_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as RAW
  },

  async submitRAW(id: string, userId: string): Promise<RAW> {
    const { data, error } = await supabase
      .from('raw_submissions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Create notification for approvers
    await supabase.from('notifications').insert([
      {
        user_id: userId,
        title: 'RAW Submitted',
        message: 'Your Risk Assessment Worksheet has been submitted for approval',
        type: 'raw_submitted',
        related_id: id,
      },
    ])

    return data as RAW
  },

  async approveRAW(id: string, approverId: string): Promise<RAW> {
    const { data, error } = await supabase
      .from('raw_submissions')
      .update({
        status: 'approved',
        approver_id: approverId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as RAW
  },

  async rejectRAW(id: string, approverId: string, comments: string): Promise<RAW> {
    const { data, error } = await supabase
      .from('raw_submissions')
      .update({
        status: 'rejected',
        approver_id: approverId,
        approver_comments: comments,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as RAW
  },

  async addHazardToRAW(hazard: Omit<RAWHazard, 'id'>): Promise<RAWHazard> {
    const { data, error } = await supabase
      .from('raw_hazards')
      .insert([hazard])
      .select()
      .single()

    if (error) throw error
    return data as RAWHazard
  },

  async getRAWHazards(rawId: string): Promise<RAWHazard[]> {
    const { data, error } = await supabase
      .from('raw_hazards')
      .select('*')
      .eq('raw_id', rawId)
      .order('rpn', { ascending: false })

    if (error) throw error
    return (data || []) as RAWHazard[]
  },

  async deleteRAW(id: string): Promise<void> {
    const { error } = await supabase.from('raw_submissions').delete().eq('id', id)

    if (error) throw error
  },
}
