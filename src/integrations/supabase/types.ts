export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      feedback_requests: {
        Row: {
          created_at: string
          feedback_session_type: string
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
          feedback_session_type?: string
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
          feedback_session_type?: string
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
      startup_updates: {
        Row: {
          challenges_faced: string | null
          created_at: string
          id: string
          images: string[] | null
          is_published: boolean
          key_achievements: string | null
          metrics_update: string | null
          startup_id: string
          team_highlights: string | null
          title: string
          upcoming_goals: string | null
          updated_at: string
          week_ending: string
        }
        Insert: {
          challenges_faced?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          is_published?: boolean
          key_achievements?: string | null
          metrics_update?: string | null
          startup_id: string
          team_highlights?: string | null
          title: string
          upcoming_goals?: string | null
          updated_at?: string
          week_ending: string
        }
        Update: {
          challenges_faced?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          is_published?: boolean
          key_achievements?: string | null
          metrics_update?: string | null
          startup_id?: string
          team_highlights?: string | null
          title?: string
          upcoming_goals?: string | null
          updated_at?: string
          week_ending?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
