export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_deletion_requests_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      additional_services: {
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
        Relationships: [
          {
            foreignKeyName: "additional_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          completion_confirmed_by_customer: boolean | null
          completion_confirmed_by_provider: boolean | null
          completion_status: string | null
          created_at: string | null
          id: string
          payment_preference: string | null
          provider_id: string
          service_date: string
          special_requirements: string | null
          status: string | null
          time_slot: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_confirmed_by_customer?: boolean | null
          completion_confirmed_by_provider?: boolean | null
          completion_status?: string | null
          created_at?: string | null
          id?: string
          payment_preference?: string | null
          provider_id: string
          service_date: string
          special_requirements?: string | null
          status?: string | null
          time_slot: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_confirmed_by_customer?: boolean | null
          completion_confirmed_by_provider?: boolean | null
          completion_status?: string | null
          created_at?: string | null
          id?: string
          payment_preference?: string | null
          provider_id?: string
          service_date?: string
          special_requirements?: string | null
          status?: string | null
          time_slot?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_connections: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          provider_confirmed: boolean | null
          provider_id: string | null
          updated_at: string | null
          user_confirmed: boolean | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          provider_confirmed?: boolean | null
          provider_id?: string | null
          updated_at?: string | null
          user_confirmed?: boolean | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          provider_confirmed?: boolean | null
          provider_id?: string | null
          updated_at?: string | null
          user_confirmed?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_connections_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          provider_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
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
        Relationships: []
      }
      provider_payment_details: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          provider_id: string
          qr_code_url: string | null
          updated_at: string | null
          upi_id: string | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          provider_id: string
          qr_code_url?: string | null
          updated_at?: string | null
          upi_id?: string | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          provider_id?: string
          qr_code_url?: string | null
          updated_at?: string | null
          upi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_payment_details_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
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
        Relationships: [
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_provider_availability: {
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
        Relationships: [
          {
            foreignKeyName: "service_provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          base_price: number
          business_name: string
          city: string
          created_at: string
          description: string | null
          id: string
          is_premium: boolean | null
          portfolio_images: string[] | null
          portfolio_link: string | null
          profile_id: string | null
          profile_image: string | null
          rating: number | null
          secondary_city: string | null
          service_type: string
          specializations: string[] | null
          status: string | null
        }
        Insert: {
          base_price: number
          business_name: string
          city: string
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          portfolio_images?: string[] | null
          portfolio_link?: string | null
          profile_id?: string | null
          profile_image?: string | null
          rating?: number | null
          secondary_city?: string | null
          service_type: string
          specializations?: string[] | null
          status?: string | null
        }
        Update: {
          base_price?: number
          business_name?: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          portfolio_images?: string[] | null
          portfolio_link?: string | null
          profile_id?: string | null
          profile_image?: string | null
          rating?: number | null
          secondary_city?: string | null
          service_type?: string
          specializations?: string[] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
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
        Relationships: [
          {
            foreignKeyName: "service_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_suggestions: {
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
        Relationships: [
          {
            foreignKeyName: "service_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_method_type: "bank_account" | "upi" | "qr_code"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
