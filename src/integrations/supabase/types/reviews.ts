export interface ReviewsTable {
  Row: {
    comment: string | null
    created_at: string
    id: string
    provider_id: string
    rating: number
    status: string | null
    updated_at: string
    user_id: string
  }
  Insert: {
    comment?: string | null
    created_at?: string
    id?: string
    provider_id: string
    rating: number
    status?: string | null
    updated_at?: string
    user_id: string
  }
  Update: {
    comment?: string | null
    created_at?: string
    id?: string
    provider_id?: string
    rating?: number
    status?: string | null
    updated_at?: string
    user_id?: string
  }
}