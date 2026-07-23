export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          inputs: Json
          model: string | null
          module: string
          output: Json
          overridden: boolean
          override_reason: string | null
          reasoning: string | null
          student_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          inputs?: Json
          model?: string | null
          module: string
          output?: Json
          overridden?: boolean
          override_reason?: string | null
          reasoning?: string | null
          student_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          inputs?: Json
          model?: string | null
          module?: string
          output?: Json
          overridden?: boolean
          override_reason?: string | null
          reasoning?: string | null
          student_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          notes: string | null
          recorded_by: string | null
          session_date: string
          status: string
          student_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          session_date: string
          status?: string
          student_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          session_date?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: string
          joined_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_group: boolean | null
          is_public: boolean
          name: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          is_public?: boolean
          name?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          is_public?: boolean
          name?: string | null
        }
        Relationships: []
      }
      children: {
        Row: {
          backup_guardian_id: string | null
          created_at: string
          date_of_birth: string | null
          grade_level: string | null
          id: string
          primary_guardian_id: string
          school_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_guardian_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          grade_level?: string | null
          id?: string
          primary_guardian_id: string
          school_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_guardian_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          grade_level?: string | null
          id?: string
          primary_guardian_id?: string
          school_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_backup_guardian_id_fkey"
            columns: ["backup_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_primary_guardian_id_fkey"
            columns: ["primary_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      course_bookings: {
        Row: {
          child_age: number
          child_name: string
          course: string
          created_at: string
          email: string | null
          id: string
          notes: string | null
          parent_name: string
          phone: string
          preferred_time: string
          region: string
          school_type: string
          status: string
          updated_at: string
        }
        Insert: {
          child_age: number
          child_name: string
          course: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          parent_name: string
          phone: string
          preferred_time: string
          region: string
          school_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          child_age?: number
          child_name?: string
          course?: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          parent_name?: string
          phone?: string
          preferred_time?: string
          region?: string
          school_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dynamic_courses: {
        Row: {
          age_range: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          display_order: number
          duration: string | null
          features_ar: string[] | null
          features_en: string[] | null
          icon: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          level: string | null
          price: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          duration?: string | null
          features_ar?: string[] | null
          features_en?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          level?: string | null
          price?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          duration?: string | null
          features_ar?: string[] | null
          features_en?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          level?: string | null
          price?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      free_session_bookings: {
        Row: {
          child_age: number
          child_name: string
          created_at: string
          id: string
          notes: string | null
          parent_email: string
          parent_phone: string
          session_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          child_age: number
          child_name: string
          created_at?: string
          id?: string
          notes?: string | null
          parent_email: string
          parent_phone: string
          session_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          child_age?: number
          child_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          parent_email?: string
          parent_phone?: string
          session_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      guardians: {
        Row: {
          address: string | null
          created_at: string
          id: string
          national_id: string | null
          occupation: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          national_id?: string | null
          occupation?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          national_id?: string | null
          occupation?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          course_id: string | null
          created_at: string
          feedback: string | null
          id: string
          reviewed_at: string | null
          score: number | null
          status: string
          student_id: string
          submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          reviewed_at?: string | null
          score?: number | null
          status?: string
          student_id: string
          submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          reviewed_at?: string | null
          score?: number | null
          status?: string
          student_id?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string | null
          current_stage_index: number
          eta_weeks: number | null
          id: string
          source: string
          stages: Json
          status: string
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          current_stage_index?: number
          eta_weeks?: number | null
          id?: string
          source?: string
          stages?: Json
          status?: string
          student_id: string
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          current_stage_index?: number
          eta_weeks?: number | null
          id?: string
          source?: string
          stages?: Json
          status?: string
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_reports: {
        Row: {
          created_at: string
          home_actions: string | null
          id: string
          improvements: string | null
          metrics: Json
          next_milestone: string | null
          period: string
          period_end: string
          period_start: string
          risk_alerts: string[]
          student_id: string
          summary: string
          support_areas: string | null
          what_happened: string | null
          why_it_happened: string | null
        }
        Insert: {
          created_at?: string
          home_actions?: string | null
          id?: string
          improvements?: string | null
          metrics?: Json
          next_milestone?: string | null
          period: string
          period_end: string
          period_start: string
          risk_alerts?: string[]
          student_id: string
          summary: string
          support_areas?: string | null
          what_happened?: string | null
          why_it_happened?: string | null
        }
        Update: {
          created_at?: string
          home_actions?: string | null
          id?: string
          improvements?: string | null
          metrics?: Json
          next_milestone?: string | null
          period?: string
          period_end?: string
          period_start?: string
          risk_alerts?: string[]
          student_id?: string
          summary?: string
          support_areas?: string | null
          what_happened?: string | null
          why_it_happened?: string | null
        }
        Relationships: []
      }
      parent_testimonials: {
        Row: {
          avatar_url: string | null
          child_name: string | null
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          parent_name: string
          rating: number | null
          testimonial_ar: string | null
          testimonial_en: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          child_name?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          parent_name: string
          rating?: number | null
          testimonial_ar?: string | null
          testimonial_en?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          child_name?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          parent_name?: string
          rating?: number | null
          testimonial_ar?: string | null
          testimonial_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      placement_assessments: {
        Row: {
          age: number | null
          answers: Json
          confidence: number | null
          created_at: string
          dimension_scores: Json
          expected_duration_weeks: number | null
          id: string
          prerequisites: string[]
          prior_experience: string | null
          reasoning: string | null
          recommended_course_id: string | null
          recommended_course_key: string | null
          recommended_level: string | null
          roadmap: Json
          self_confidence: number | null
          status: string
          strengths: string[]
          student_id: string
          target_course: string | null
          updated_at: string
          weaknesses: string[]
        }
        Insert: {
          age?: number | null
          answers?: Json
          confidence?: number | null
          created_at?: string
          dimension_scores?: Json
          expected_duration_weeks?: number | null
          id?: string
          prerequisites?: string[]
          prior_experience?: string | null
          reasoning?: string | null
          recommended_course_id?: string | null
          recommended_course_key?: string | null
          recommended_level?: string | null
          roadmap?: Json
          self_confidence?: number | null
          status?: string
          strengths?: string[]
          student_id: string
          target_course?: string | null
          updated_at?: string
          weaknesses?: string[]
        }
        Update: {
          age?: number | null
          answers?: Json
          confidence?: number | null
          created_at?: string
          dimension_scores?: Json
          expected_duration_weeks?: number | null
          id?: string
          prerequisites?: string[]
          prior_experience?: string | null
          reasoning?: string | null
          recommended_course_id?: string | null
          recommended_course_key?: string | null
          recommended_level?: string | null
          roadmap?: Json
          self_confidence?: number | null
          status?: string
          strengths?: string[]
          student_id?: string
          target_course?: string | null
          updated_at?: string
          weaknesses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "placement_assessments_recommended_course_id_fkey"
            columns: ["recommended_course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          chosen_course: string
          created_at: string
          examinee_age: number
          examinee_name: string
          final_level: string | null
          id: string
          recommended_course: string | null
          score: number
          total_questions: number
        }
        Insert: {
          answers?: Json | null
          chosen_course: string
          created_at?: string
          examinee_age: number
          examinee_name: string
          final_level?: string | null
          id?: string
          recommended_course?: string | null
          score?: number
          total_questions?: number
        }
        Update: {
          answers?: Json | null
          chosen_course?: string
          created_at?: string
          examinee_age?: number
          examinee_name?: string
          final_level?: string | null
          id?: string
          recommended_course?: string | null
          score?: number
          total_questions?: number
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_option: number
          course: string
          created_at: string
          difficulty: string
          dimension: string | null
          display_order: number
          explanation_ar: string | null
          explanation_en: string | null
          id: string
          is_visible: boolean
          max_age: number
          min_age: number
          option_1_ar: string
          option_1_en: string | null
          option_2_ar: string
          option_2_en: string | null
          option_3_ar: string
          option_3_en: string | null
          option_4_ar: string
          option_4_en: string | null
          question_ar: string
          question_en: string | null
          updated_at: string
        }
        Insert: {
          correct_option?: number
          course: string
          created_at?: string
          difficulty?: string
          dimension?: string | null
          display_order?: number
          explanation_ar?: string | null
          explanation_en?: string | null
          id?: string
          is_visible?: boolean
          max_age?: number
          min_age?: number
          option_1_ar: string
          option_1_en?: string | null
          option_2_ar: string
          option_2_en?: string | null
          option_3_ar: string
          option_3_en?: string | null
          option_4_ar: string
          option_4_en?: string | null
          question_ar: string
          question_en?: string | null
          updated_at?: string
        }
        Update: {
          correct_option?: number
          course?: string
          created_at?: string
          difficulty?: string
          dimension?: string | null
          display_order?: number
          explanation_ar?: string | null
          explanation_en?: string | null
          id?: string
          is_visible?: boolean
          max_age?: number
          min_age?: number
          option_1_ar?: string
          option_1_en?: string | null
          option_2_ar?: string
          option_2_en?: string | null
          option_3_ar?: string
          option_3_en?: string | null
          option_4_ar?: string
          option_4_en?: string | null
          question_ar?: string
          question_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          id: string
          section: string
          updated_at: string
          updated_by: string | null
          value_ar: string | null
          value_en: string | null
        }
        Insert: {
          content_key: string
          id?: string
          section: string
          updated_at?: string
          updated_by?: string | null
          value_ar?: string | null
          value_en?: string | null
        }
        Update: {
          content_key?: string
          id?: string
          section?: string
          updated_at?: string
          updated_by?: string | null
          value_ar?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          display_order: number
          id: string
          is_visible: boolean
          label_ar: string
          label_en: string
          section_key: string
          updated_at: string
        }
        Insert: {
          display_order?: number
          id?: string
          is_visible?: boolean
          label_ar: string
          label_en: string
          section_key: string
          updated_at?: string
        }
        Update: {
          display_order?: number
          id?: string
          is_visible?: boolean
          label_ar?: string
          label_en?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_scores: {
        Row: {
          id: string
          recorded_at: string
          score: number
          skill: string
          source: string
          source_id: string | null
          student_id: string
        }
        Insert: {
          id?: string
          recorded_at?: string
          score: number
          skill: string
          source: string
          source_id?: string | null
          student_id: string
        }
        Update: {
          id?: string
          recorded_at?: string
          score?: number
          skill?: string
          source?: string
          source_id?: string | null
          student_id?: string
        }
        Relationships: []
      }
      student_intelligence: {
        Row: {
          achievements: Json
          ai_narrative: string | null
          ai_narrative_updated_at: string | null
          ai_score: number
          badges: Json
          communication_score: number
          completed_courses: Json
          consistency_score: number
          course_progress: number
          created_at: string
          creativity_score: number
          current_course_id: string | null
          current_level: string | null
          learning_speed: number
          logical_thinking_score: number
          milestones: Json
          next_recommended_course_id: string | null
          predicted_success_rate: number
          presentation_score: number
          problem_solving_score: number
          programming_score: number
          recommended_improvements: string[]
          risk_indicators: string[]
          strengths: string[]
          student_id: string
          teamwork_score: number
          updated_at: string
          weaknesses: string[]
        }
        Insert: {
          achievements?: Json
          ai_narrative?: string | null
          ai_narrative_updated_at?: string | null
          ai_score?: number
          badges?: Json
          communication_score?: number
          completed_courses?: Json
          consistency_score?: number
          course_progress?: number
          created_at?: string
          creativity_score?: number
          current_course_id?: string | null
          current_level?: string | null
          learning_speed?: number
          logical_thinking_score?: number
          milestones?: Json
          next_recommended_course_id?: string | null
          predicted_success_rate?: number
          presentation_score?: number
          problem_solving_score?: number
          programming_score?: number
          recommended_improvements?: string[]
          risk_indicators?: string[]
          strengths?: string[]
          student_id: string
          teamwork_score?: number
          updated_at?: string
          weaknesses?: string[]
        }
        Update: {
          achievements?: Json
          ai_narrative?: string | null
          ai_narrative_updated_at?: string | null
          ai_score?: number
          badges?: Json
          communication_score?: number
          completed_courses?: Json
          consistency_score?: number
          course_progress?: number
          created_at?: string
          creativity_score?: number
          current_course_id?: string | null
          current_level?: string | null
          learning_speed?: number
          logical_thinking_score?: number
          milestones?: Json
          next_recommended_course_id?: string | null
          predicted_success_rate?: number
          presentation_score?: number
          problem_solving_score?: number
          programming_score?: number
          recommended_improvements?: string[]
          risk_indicators?: string[]
          strengths?: string[]
          student_id?: string
          teamwork_score?: number
          updated_at?: string
          weaknesses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "student_intelligence_current_course_id_fkey"
            columns: ["current_course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_intelligence_next_recommended_course_id_fkey"
            columns: ["next_recommended_course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          project_type: string | null
          student_id: string | null
          technologies: string[] | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          project_type?: string | null
          student_id?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          project_type?: string | null
          student_id?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      students_showcase: {
        Row: {
          achievements: string[] | null
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          grade_level: string | null
          id: string
          is_featured: boolean | null
          name: string
          projects_count: number | null
          stickers_count: number | null
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          grade_level?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          projects_count?: number | null
          stickers_count?: number | null
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          grade_level?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          projects_count?: number | null
          stickers_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      teacher_assignments: {
        Row: {
          assigned_by: string | null
          course_id: string | null
          created_at: string
          id: string
          is_active: boolean
          notes: string | null
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_evaluations: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          notes: string | null
          overall_rating: number | null
          skill_ratings: Json
          student_id: string
          teacher_id: string
          updated_at: string
          visible_to_parent: boolean
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          overall_rating?: number | null
          skill_ratings?: Json
          student_id: string
          teacher_id: string
          updated_at?: string
          visible_to_parent?: boolean
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          overall_rating?: number | null
          skill_ratings?: Json
          student_id?: string
          teacher_id?: string
          updated_at?: string
          visible_to_parent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "teacher_evaluations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "dynamic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string
          education: string | null
          id: string
          specialization: string[] | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          education?: string | null
          id?: string
          specialization?: string[] | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          education?: string | null
          id?: string
          specialization?: string[] | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trainers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      quiz_questions_public: {
        Row: {
          course: string | null
          created_at: string | null
          difficulty: string | null
          display_order: number | null
          id: string | null
          is_visible: boolean | null
          max_age: number | null
          min_age: number | null
          option_1_ar: string | null
          option_1_en: string | null
          option_2_ar: string | null
          option_2_en: string | null
          option_3_ar: string | null
          option_3_en: string | null
          option_4_ar: string | null
          option_4_en: string | null
          question_ar: string | null
          question_en: string | null
          updated_at: string | null
        }
        Insert: {
          course?: string | null
          created_at?: string | null
          difficulty?: string | null
          display_order?: number | null
          id?: string | null
          is_visible?: boolean | null
          max_age?: number | null
          min_age?: number | null
          option_1_ar?: string | null
          option_1_en?: string | null
          option_2_ar?: string | null
          option_2_en?: string | null
          option_3_ar?: string | null
          option_3_en?: string | null
          option_4_ar?: string | null
          option_4_en?: string | null
          question_ar?: string | null
          question_en?: string | null
          updated_at?: string | null
        }
        Update: {
          course?: string | null
          created_at?: string | null
          difficulty?: string | null
          display_order?: number | null
          id?: string | null
          is_visible?: boolean | null
          max_age?: number | null
          min_age?: number | null
          option_1_ar?: string | null
          option_1_en?: string | null
          option_2_ar?: string | null
          option_2_en?: string | null
          option_3_ar?: string | null
          option_3_en?: string | null
          option_4_ar?: string | null
          option_4_en?: string | null
          question_ar?: string | null
          question_en?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_quiz_answer: {
        Args: { _chosen: number; _question_id: string }
        Returns: {
          correct_option: number
          explanation_ar: string
          explanation_en: string
          is_correct: boolean
        }[]
      }
      is_assigned_teacher: { Args: { _student_id: string }; Returns: boolean }
      is_guardian_of: { Args: { _child_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "guardian" | "child" | "trainer"
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
    Enums: {
      app_role: ["admin", "guardian", "child", "trainer"],
    },
  },
} as const
