import { create } from 'zustand'

export interface RAW {
  id: string
  user_id: string
  venue_id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'changes_requested'
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  hazards: RAWHazard[]
  created_at: string
  updated_at: string
  submitted_at: string | null
  venue_name?: string
}

export interface RAWHazard {
  id: string
  raw_id: string
  hazard_description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  likelihood: 'low' | 'medium' | 'high' | 'very_high'
  rpn: number
  control_measures: string
}

interface RAWStore {
  raws: RAW[]
  selectedRAW: RAW | null
  loading: boolean
  setRAWs: (raws: RAW[]) => void
  setSelectedRAW: (raw: RAW | null) => void
  setLoading: (loading: boolean) => void
  addRAW: (raw: RAW) => void
  updateRAW: (id: string, raw: Partial<RAW>) => void
}

export const useRAWStore = create<RAWStore>((set) => ({
  raws: [],
  selectedRAW: null,
  loading: false,
  setRAWs: (raws) => set({ raws }),
  setSelectedRAW: (raw) => set({ selectedRAW: raw }),
  setLoading: (loading) => set({ loading }),
  addRAW: (raw) => set((state) => ({ raws: [raw, ...state.raws] })),
  updateRAW: (id, raw) =>
    set((state) => ({
      raws: state.raws.map((r) => (r.id === id ? { ...r, ...raw } : r)),
    })),
}))
