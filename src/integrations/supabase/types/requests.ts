export interface ServiceRequestsTable {
  Row: {
    created_at: string | null
    description: string | null
    id: string
    provider_id: string | null
    service_type: string
    status: string | null
    updated_at: string | null
    user_id: string | null
  }
  Insert: {
    created_at?: string | null
    description?: string | null
    id?: string
    provider_id?: string | null
    service_type: string
    status?: string | null
    updated_at?: string | null
    user_id?: string | null
  }
  Update: {
    created_at?: string | null
    description?: string | null
    id?: string
    provider_id?: string | null
    service_type?: string
    status?: string | null
    updated_at?: string | null
    user_id?: string | null
  }
}

export interface ServiceSuggestionsTable {
  Row: {
    created_at: string | null
    description: string
    id: string
    status: string | null
    suggestion_type: string
    user_id: string | null
  }
  Insert: {
    created_at?: string | null
    description: string
    id?: string
    status?: string | null
    suggestion_type: string
    user_id?: string | null
  }
  Update: {
    created_at?: string | null
    description?: string
    id?: string
    status?: string | null
    suggestion_type?: string
    user_id?: string | null
  }
}