export interface AdditionalServicesTable {
  Row: {
    created_at: string | null
    description: string
    id: string
    provider_id: string
    service_type: string
    status: string | null
    updated_at: string | null
  }
  Insert: {
    created_at?: string | null
    description: string
    id?: string
    provider_id: string
    service_type: string
    status?: string | null
    updated_at?: string | null
  }
  Update: {
    created_at?: string | null
    description?: string
    id?: string
    provider_id?: string
    service_type?: string
    status?: string | null
    updated_at?: string | null
  }
}

export interface ServiceProvidersTable {
  Row: {
    base_price: number
    business_name: string
    city: string
    created_at: string
    description: string | null
    id: string
    is_premium: boolean | null
    portfolio_link: string | null
    profile_id: string | null
    profile_image: string | null
    rating: number | null
    service_type: string
  }
  Insert: {
    base_price: number
    business_name: string
    city: string
    created_at?: string
    description?: string | null
    id?: string
    is_premium?: boolean | null
    portfolio_link?: string | null
    profile_id?: string | null
    profile_image?: string | null
    rating?: number | null
    service_type: string
  }
  Update: {
    base_price?: number
    business_name?: string
    city?: string
    created_at?: string
    description?: string | null
    id?: string
    is_premium?: boolean | null
    portfolio_link?: string | null
    profile_id?: string | null
    profile_image?: string | null
    rating?: number | null
    service_type?: string
  }
}

export interface ServiceProviderAvailabilityTable {
  Row: {
    created_at: string | null
    day_of_week: number
    end_time: string
    id: string
    is_available: boolean | null
    provider_id: string
    start_time: string
    updated_at: string | null
  }
  Insert: {
    created_at?: string | null
    day_of_week: number
    end_time: string
    id?: string
    is_available?: boolean | null
    provider_id: string
    start_time: string
    updated_at?: string | null
  }
  Update: {
    created_at?: string | null
    day_of_week?: number
    end_time?: string
    id?: string
    is_available?: boolean | null
    provider_id?: string
    start_time?: string
    updated_at?: string | null
  }
}