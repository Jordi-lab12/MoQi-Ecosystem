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
      feedback_requests: {
        Row: {
          created_at: string
          feedback_type: string
          id: string
          message: string | null
          scheduled_date: string
          scheduled_time: string
          startup_id: string
          status: string
          swiper_id: string
          teams_link: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback_type?: string
          id?: string
          message?: string | null
          scheduled_date: string
          scheduled_time: string
          startup_id: string
          status?: string
          swiper_id: string
          teams_link?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback_type?: string
          id?: string
          message?: string | null
          scheduled_date?: string
          scheduled_time?: string
          startup_id?: string
          status?: string
          swiper_id?: string
          teams_link?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_requests_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_requests_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: string | null
          created_at: string
          description: string | null
          employees: string | null
          founded: string | null
          gender: string | null
          id: string
          image: string | null
          industry: string | null
          logo: string | null
          mission: string | null
          name: string
          role: string
          study: string | null
          tagline: string | null
          updated_at: string
          user_id: string
          username: string
          usp: string | null
          vision: string | null
        }
        Insert: {
          age?: string | null
          created_at?: string
          description?: string | null
          employees?: string | null
          founded?: string | null
          gender?: string | null
          id?: string
          image?: string | null
          industry?: string | null
          logo?: string | null
          mission?: string | null
          name: string
          role: string
          study?: string | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          username: string
          usp?: string | null
          vision?: string | null
        }
        Update: {
          age?: string | null
          created_at?: string
          description?: string | null
          employees?: string | null
          founded?: string | null
          gender?: string | null
          id?: string
          image?: string | null
          industry?: string | null
          logo?: string | null
          mission?: string | null
          name?: string
          role?: string
          study?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          usp?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      swiper_interactions: {
        Row: {
          coin_allocation: number
          created_at: string
          feedback_preference: string
          has_liked: boolean
          id: string
          startup_id: string
          swiper_id: string
        }
        Insert: {
          coin_allocation?: number
          created_at?: string
          feedback_preference: string
          has_liked: boolean
          id?: string
          startup_id: string
          swiper_id: string
        }
        Update: {
          coin_allocation?: number
          created_at?: string
          feedback_preference?: string
          has_liked?: boolean
          id?: string
          startup_id?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swiper_interactions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swiper_interactions_swiper_id_fkey"
            columns: ["swiper_id"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
