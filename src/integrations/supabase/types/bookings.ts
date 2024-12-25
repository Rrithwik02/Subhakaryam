export interface BookingsTable {
  Row: {
    created_at: string | null
    id: string
    provider_id: string
    service_date: string
    special_requirements: string | null
    status: string | null
    time_slot: string
    updated_at: string | null
    user_id: string
  }
  Insert: {
    created_at?: string | null
    id?: string
    provider_id: string
    service_date: string
    special_requirements?: string | null
    status?: string | null
    time_slot: string
    updated_at?: string | null
    user_id: string
  }
  Update: {
    created_at?: string | null
    id?: string
    provider_id?: string
    service_date?: string
    special_requirements?: string | null
    status?: string | null
    time_slot?: string
    updated_at?: string | null
    user_id?: string
  }
}