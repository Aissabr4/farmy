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
      crop_history: {
        Row: {
          created_at: string | null
          crop: string
          field_id: string | null
          id: string
          notes: string | null
          year: string
          yield: number
        }
        Insert: {
          created_at?: string | null
          crop: string
          field_id?: string | null
          id?: string
          notes?: string | null
          year: string
          yield: number
        }
        Update: {
          created_at?: string | null
          crop?: string
          field_id?: string | null
          id?: string
          notes?: string | null
          year?: string
          yield?: number
        }
        Relationships: [
          {
            foreignKeyName: "crop_history_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_results: {
        Row: {
          component: string
          id: string
          message: string
          status: string
          timestamp: string | null
        }
        Insert: {
          component: string
          id?: string
          message: string
          status: string
          timestamp?: string | null
        }
        Update: {
          component?: string
          id?: string
          message?: string
          status?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      farms: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          size: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          size?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fields: {
        Row: {
          created_at: string | null
          crop_type: string
          farm_id: string | null
          field_image: string | null
          growth_stage: string
          harvest_date: string | null
          id: string
          location: string
          name: string
          planting_date: string | null
          size: number
          soil_moisture: number
          status: string
          sunlight: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crop_type: string
          farm_id?: string | null
          field_image?: string | null
          growth_stage: string
          harvest_date?: string | null
          id?: string
          location: string
          name: string
          planting_date?: string | null
          size: number
          soil_moisture: number
          status: string
          sunlight: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crop_type?: string
          farm_id?: string | null
          field_image?: string | null
          growth_stage?: string
          harvest_date?: string | null
          id?: string
          location?: string
          name?: string
          planting_date?: string | null
          size?: number
          soil_moisture?: number
          status?: string
          sunlight?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fields_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          due_date: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          priority: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          message: string
          priority: string | null
          read: boolean | null
          related_id: string | null
          related_type: string | null
          status: string | null
          time: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          id?: string
          message: string
          priority?: string | null
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          status?: string | null
          time?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string
          priority?: string | null
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          status?: string | null
          time?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_data: {
        Row: {
          field_id: string | null
          id: string
          moisture: number
          nitrogen: number | null
          ph: number
          phosphorus: number | null
          potassium: number | null
          recorded_at: string | null
          type: string
        }
        Insert: {
          field_id?: string | null
          id?: string
          moisture: number
          nitrogen?: number | null
          ph: number
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string | null
          type: string
        }
        Update: {
          field_id?: string | null
          id?: string
          moisture?: number
          nitrogen?: number | null
          ph?: number
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "soil_data_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      system_status: {
        Row: {
          details: string | null
          id: string
          last_checked: string
          name: string
          status: string
          updated_at: string | null
          uptime: string | null
        }
        Insert: {
          details?: string | null
          id?: string
          last_checked: string
          name: string
          status: string
          updated_at?: string | null
          uptime?: string | null
        }
        Update: {
          details?: string | null
          id?: string
          last_checked?: string
          name?: string
          status?: string
          updated_at?: string | null
          uptime?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to_id: string | null
          assigned_to_name: string
          created_at: string | null
          description: string | null
          due_date: string | null
          field_id: string | null
          field_name: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          assigned_to_name: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          field_id?: string | null
          field_name: string
          id?: string
          priority: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          assigned_to_name?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          field_id?: string | null
          field_name?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          date_added: string | null
          email: string
          farm_id: string | null
          id: string
          name: string
          permissions: string[] | null
          role: string
          status: string
        }
        Insert: {
          avatar?: string | null
          date_added?: string | null
          email: string
          farm_id?: string | null
          id?: string
          name: string
          permissions?: string[] | null
          role: string
          status: string
        }
        Update: {
          avatar?: string | null
          date_added?: string | null
          email?: string
          farm_id?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          condition: string
          humidity: number
          id: string
          location: string
          recorded_at: string | null
          temperature: number
          wind_speed: number
        }
        Insert: {
          condition: string
          humidity: number
          id?: string
          location: string
          recorded_at?: string | null
          temperature: number
          wind_speed: number
        }
        Update: {
          condition?: string
          humidity?: number
          id?: string
          location?: string
          recorded_at?: string | null
          temperature?: number
          wind_speed?: number
        }
        Relationships: []
      }
      weather_forecast: {
        Row: {
          condition: string
          created_at: string | null
          day: string
          id: string
          temperature: number
        }
        Insert: {
          condition: string
          created_at?: string | null
          day: string
          id?: string
          temperature: number
        }
        Update: {
          condition?: string
          created_at?: string | null
          day?: string
          id?: string
          temperature?: number
        }
        Relationships: []
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
