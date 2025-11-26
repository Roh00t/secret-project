export interface User {
  id: string
  email: string
  name?: string
  role: 'officer' | 'approver' | 'facility' | 'admin'
}

export interface Venue {
  id: string
  name: string
  address?: string
}

export interface RAWTemplate {
  id: string
  title: string
}

export interface RAWSubmission {
  id: string
  templateId: string
  venueId: string
  answers: RAWAnswer[]
}

export interface RAWAnswer {
  id: string
  submissionId: string
  question: string
  value: string
}

export interface VenueHazard {
  id: string
  venueId: string
  description: string
  active: boolean
}

export interface HazardIssue {
  id: string
  hazardId: string
  status: string
}

export interface Incident {
  id: string
  venueId: string
  description: string
}

export interface AuditLog {
  id: string
  entity: string
  entityId: string
  action: string
  actorId?: string
  timestamp: string
}
