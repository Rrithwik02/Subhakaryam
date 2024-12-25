export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Tables
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables = {
  additional_services: AdditionalServicesTable
  bookings: BookingsTable
  profiles: ProfilesTable
  reviews: ReviewsTable
  service_provider_availability: ServiceProviderAvailabilityTable
  service_providers: ServiceProvidersTable
  service_requests: ServiceRequestsTable
  service_suggestions: ServiceSuggestionsTable
}