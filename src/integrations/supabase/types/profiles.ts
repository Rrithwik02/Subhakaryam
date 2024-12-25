export interface ProfilesTable {
  Row: {
    address: string | null
    created_at: string
    email: string | null
    full_name: string | null
    id: string
    phone: string | null
    profile_image: string | null
    updated_at: string
    user_type: string | null
  }
  Insert: {
    address?: string | null
    created_at?: string
    email?: string | null
    full_name?: string | null
    id: string
    phone?: string | null
    profile_image?: string | null
    updated_at?: string
    user_type?: string | null
  }
  Update: {
    address?: string | null
    created_at?: string
    email?: string | null
    full_name?: string | null
    id?: string
    phone?: string | null
    profile_image?: string | null
    updated_at?: string
    user_type?: string | null
  }
}