export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enhanced Database Schema for Children's Programming Academy
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      // Core user profiles - enhanced
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          phone: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          email_verified: boolean
          last_login: string | null
          preferences: Json | null
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          avatar_url?: string | null
          role: Database["public"]["Enums"]["user_role"]
          phone?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          phone?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
          preferences?: Json | null
        }
        Relationships: []
      }

      // Enhanced student profiles
      student_profiles: {
        Row: {
          id: string
          user_id: string
          age: number
          grade_level: string | null
          school_name: string | null
          parent_guardian_id: string | null
          primary_guardian_id: string
          backup_guardian_id: string | null
          learning_preferences: Json | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          learning_goals: string | null
          interests: string[] | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age: number
          grade_level?: string | null
          school_name?: string | null
          parent_guardian_id?: string | null
          primary_guardian_id: string
          backup_guardian_id?: string | null
          learning_preferences?: Json | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          learning_goals?: string | null
          interests?: string[] | null
          timezone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number
          grade_level?: string | null
          school_name?: string | null
          parent_guardian_id?: string | null
          primary_guardian_id?: string
          backup_guardian_id?: string | null
          learning_preferences?: Json | null
          skill_level?: Database["public"]["Enums"]["skill_level"]
          learning_goals?: string | null
          interests?: string[] | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_primary_guardian_id_fkey"
            columns: ["primary_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardian_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_profiles_backup_guardian_id_fkey"
            columns: ["backup_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardian_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Enhanced guardian profiles
      guardian_profiles: {
        Row: {
          id: string
          user_id: string
          relationship: Database["public"]["Enums"]["guardian_relationship"]
          occupation: string | null
          address: string | null
          emergency_contact: Json | null
          notification_preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          relationship: Database["public"]["Enums"]["guardian_relationship"]
          occupation?: string | null
          address?: string | null
          emergency_contact?: Json | null
          notification_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          relationship?: Database["public"]["Enums"]["guardian_relationship"]
          occupation?: string | null
          address?: string | null
          emergency_contact?: Json | null
          notification_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Enhanced instructor profiles
      instructor_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          specialization: string[] | null
          education: string | null
          certifications: string[] | null
          years_of_experience: number | null
          hourly_rate: number | null
          languages: string[] | null
          availability: Json | null
          rating: number | null
          total_students: number | null
          total_courses: number | null
          background_check: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          specialization?: string[] | null
          education?: string | null
          certifications?: string[] | null
          years_of_experience?: number | null
          hourly_rate?: number | null
          languages?: string[] | null
          availability?: Json | null
          rating?: number | null
          total_students?: number | null
          total_courses?: number | null
          background_check?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          specialization?: string[] | null
          education?: string | null
          certifications?: string[] | null
          years_of_experience?: number | null
          hourly_rate?: number | null
          languages?: string[] | null
          availability?: Json | null
          rating?: number | null
          total_students?: number | null
          total_courses?: number | null
          background_check?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Enhanced courses
      courses: {
        Row: {
          id: string
          title: string
          description: string
          category: Database["public"]["Enums"]["course_category"]
          age_group: Database["public"]["Enums"]["age_group"]
          skill_level: Database["public"]["Enums"]["skill_level"]
          duration_weeks: number
          price: number
          currency: string
          thumbnail_url: string | null
          intro_video_url: string | null
          language: string
          max_students: number
          current_students: number
          instructor_id: string
          status: Database["public"]["Enums"]["course_status"]
          tags: string[] | null
          learning_objectives: string[] | null
          prerequisites: string[] | null
          curriculum: Json | null
          start_date: string | null
          end_date: string | null
          schedule: Json | null
          rating: number | null
          enrollment_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: Database["public"]["Enums"]["course_category"]
          age_group: Database["public"]["Enums"]["age_group"]
          skill_level: Database["public"]["Enums"]["skill_level"]
          duration_weeks: number
          price: number
          currency: string
          thumbnail_url?: string | null
          intro_video_url?: string | null
          language: string
          max_students: number
          current_students?: number
          instructor_id: string
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          curriculum?: Json | null
          start_date?: string | null
          end_date?: string | null
          schedule?: Json | null
          rating?: number | null
          enrollment_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: Database["public"]["Enums"]["course_category"]
          age_group?: Database["public"]["Enums"]["age_group"]
          skill_level?: Database["public"]["Enums"]["skill_level"]
          duration_weeks?: number
          price?: number
          currency?: string
          thumbnail_url?: string | null
          intro_video_url?: string | null
          language?: string
          max_students?: number
          current_students?: number
          instructor_id?: string
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          curriculum?: Json | null
          start_date?: string | null
          end_date?: string | null
          schedule?: Json | null
          rating?: number | null
          enrollment_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Course enrollments
      course_enrollments: {
        Row: {
          id: string
          course_id: string
          student_id: string
          enrolled_by: string | null
          enrollment_date: string
          status: Database["public"]["Enums"]["enrollment_status"]
          completion_date: string | null
          progress_percentage: number
          certificate_issued: boolean
          certificate_url: string | null
          grade: string | null
          feedback_instructor: string | null
          feedback_student: string | null
          rating: number | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          amount_paid: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          enrolled_by?: string | null
          enrollment_date?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          completion_date?: string | null
          progress_percentage?: number
          certificate_issued?: boolean
          certificate_url?: string | null
          grade?: string | null
          feedback_instructor?: string | null
          feedback_student?: string | null
          rating?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          amount_paid?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          student_id?: string
          enrolled_by?: string | null
          enrollment_date?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          completion_date?: string | null
          progress_percentage?: number
          certificate_issued?: boolean
          certificate_url?: string | null
          grade?: string | null
          feedback_instructor?: string | null
          feedback_student?: string | null
          rating?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          amount_paid?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "course_enrollments_enrolled_by_fkey"
            columns: ["enrolled_by"]
            isOneToOne: false
            referencedRelation: "guardian_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Course lessons
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          content: Json | null
          video_url: string | null
          duration_minutes: number
          order_index: number
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          is_required: boolean
          unlock_conditions: Json | null
          resources: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          content?: Json | null
          video_url?: string | null
          duration_minutes: number
          order_index: number
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          is_required?: boolean
          unlock_conditions?: Json | null
          resources?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          content?: Json | null
          video_url?: string | null
          duration_minutes?: number
          order_index?: number
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          is_required?: boolean
          unlock_conditions?: Json | null
          resources?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }

      // Student progress tracking
      student_progress: {
        Row: {
          id: string
          student_id: string
          course_id: string
          lesson_id: string
          status: Database["public"]["Enums"]["progress_status"]
          completion_percentage: number
          time_spent_minutes: number
          score: number | null
          attempts: number
          last_accessed: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          lesson_id: string
          status?: Database["public"]["Enums"]["progress_status"]
          completion_percentage?: number
          time_spent_minutes?: number
          score?: number | null
          attempts?: number
          last_accessed?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          lesson_id?: string
          status?: Database["public"]["Enums"]["progress_status"]
          completion_percentage?: number
          time_spent_minutes?: number
          score?: number | null
          attempts?: number
          last_accessed?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Assignments
      assignments: {
        Row: {
          id: string
          course_id: string
          lesson_id: string | null
          title: string
          description: string
          instructions: string | null
          assignment_type: Database["public"]["Enums"]["assignment_type"]
          max_score: number
          due_date: string | null
          allow_late_submission: boolean
          resources: Json | null
          solution_template: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          lesson_id?: string | null
          title: string
          description: string
          instructions?: string | null
          assignment_type: Database["public"]["Enums"]["assignment_type"]
          max_score: number
          due_date?: string | null
          allow_late_submission?: boolean
          resources?: Json | null
          solution_template?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          lesson_id?: string | null
          title?: string
          description?: string
          instructions?: string | null
          assignment_type?: Database["public"]["Enums"]["assignment_type"]
          max_score?: number
          due_date?: string | null
          allow_late_submission?: boolean
          resources?: Json | null
          solution_template?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }

      // Assignment submissions
      assignment_submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          submission_url: string | null
          submission_text: string | null
          submission_code: string | null
          file_attachments: Json | null
          submitted_at: string
          is_late: boolean
          score: number | null
          feedback: string | null
          graded_by: string | null
          graded_at: string | null
          status: Database["public"]["Enums"]["submission_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          submission_url?: string | null
          submission_text?: string | null
          submission_code?: string | null
          file_attachments?: Json | null
          submitted_at?: string
          is_late?: boolean
          score?: number | null
          feedback?: string | null
          graded_by?: string | null
          graded_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          submission_url?: string | null
          submission_text?: string | null
          submission_code?: string | null
          file_attachments?: Json | null
          submitted_at?: string
          is_late?: boolean
          score?: number | null
          feedback?: string | null
          graded_by?: string | null
          graded_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "assignment_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Gamification and achievements
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          type: Database["public"]["Enums"]["achievement_type"]
          icon: string | null
          badge_color: string | null
          points: number
          unlock_conditions: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: Database["public"]["Enums"]["achievement_type"]
          icon?: string | null
          badge_color?: string | null
          points: number
          unlock_conditions?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: Database["public"]["Enums"]["achievement_type"]
          icon?: string | null
          badge_color?: string | null
          points?: number
          unlock_conditions?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Student achievements
      student_achievements: {
        Row: {
          id: string
          student_id: string
          achievement_id: string
          earned_date: string
          course_id: string | null
          related_entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          achievement_id: string
          earned_date?: string
          course_id?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          achievement_id?: string
          earned_date?: string
          course_id?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_achievements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }

      // Points and rewards
      points_transactions: {
        Row: {
          id: string
          student_id: string
          points: number
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          source: string | null
          description: string | null
          related_entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          points: number
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          source?: string | null
          description?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          points?: number
          transaction_type?: Database["public"]["Enums"]["point_transaction_type"]
          source?: string | null
          description?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Student projects
      student_projects: {
        Row: {
          id: string
          student_id: string
          course_id: string | null
          title: string
          description: string | null
          project_url: string | null
          demo_url: string | null
          screenshot_url: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          technologies: string[] | null
          complexity_level: Database["public"]["Enums"]["skill_level"]
          instructor_rating: number | null
          instructor_feedback: string | null
          public_visible: boolean
          featured: boolean
          likes_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id?: string | null
          title: string
          description?: string | null
          project_url?: string | null
          demo_url?: string | null
          screenshot_url?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          technologies?: string[] | null
          complexity_level?: Database["public"]["Enums"]["skill_level"]
          instructor_rating?: number | null
          instructor_feedback?: string | null
          public_visible?: boolean
          featured?: boolean
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string | null
          title?: string
          description?: string | null
          project_url?: string | null
          demo_url?: string | null
          screenshot_url?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          technologies?: string[] | null
          complexity_level?: Database["public"]["Enums"]["skill_level"]
          instructor_rating?: number | null
          instructor_feedback?: string | null
          public_visible?: boolean
          featured?: boolean
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_projects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }

      // Certificates
      certificates: {
        Row: {
          id: string
          student_id: string
          course_id: string
          certificate_url: string
          certificate_number: string
          issued_date: string
          grade: string
          instructor_signature: string | null
          verification_code: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          certificate_url: string
          certificate_number: string
          issued_date?: string
          grade: string
          instructor_signature?: string | null
          verification_code: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          certificate_url?: string
          certificate_number?: string
          issued_date?: string
          grade?: string
          instructor_signature?: string | null
          verification_code?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }

      // Parent reviews and feedback
      parent_reviews: {
        Row: {
          id: string
          parent_id: string
          student_id: string
          course_id: string | null
          instructor_id: string | null
          review_type: Database["public"]["Enums"]["review_type"]
          rating: number
          written_review: string | null
          video_url: string | null
          video_thumbnail: string | null
          review_date: string
          status: Database["public"]["Enums"]["review_status"]
          featured: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          student_id: string
          course_id?: string | null
          instructor_id?: string | null
          review_type: Database["public"]["Enums"]["review_type"]
          rating: number
          written_review?: string | null
          video_url?: string | null
          video_thumbnail?: string | null
          review_date?: string
          status?: Database["public"]["Enums"]["review_status"]
          featured?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
          course_id?: string | null
          instructor_id?: string | null
          review_type?: Database["public"]["Enums"]["review_type"]
          rating?: number
          written_review?: string | null
          video_url?: string | null
          video_thumbnail?: string | null
          review_date?: string
          status?: Database["public"]["Enums"]["review_status"]
          featured?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "guardian_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "parent_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "parent_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_reviews_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Notifications
      notifications: {
        Row: {
          id: string
          user_id: string
          type: Database["public"]["Enums"]["notification_type"]
          title: string
          message: string
          data: Json | null
          read: boolean
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: Database["public"]["Enums"]["notification_type"]
          title: string
          message: string
          data?: Json | null
          read?: boolean
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          created_at?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Live sessions
      live_sessions: {
        Row: {
          id: string
          course_id: string
          instructor_id: string
          title: string
          description: string | null
          scheduled_time: string
          duration_minutes: number
          session_url: string | null
          recording_url: string | null
          max_participants: number
          is_recorded: boolean
          status: Database["public"]["Enums"]["session_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          instructor_id: string
          title: string
          description?: string | null
          scheduled_time: string
          duration_minutes: number
          session_url?: string | null
          recording_url?: string | null
          max_participants: number
          is_recorded?: boolean
          status?: Database["public"]["Enums"]["session_status"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          instructor_id?: string
          title?: string
          description?: string | null
          scheduled_time?: string
          duration_minutes?: number
          session_url?: string | null
          recording_url?: string | null
          max_participants?: number
          is_recorded?: boolean
          status?: Database["public"]["Enums"]["session_status"]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }

      // Session attendances
      session_attendances: {
        Row: {
          id: string
          session_id: string
          student_id: string
          joined_at: string | null
          left_at: string | null
          duration_attended: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          student_id: string
          joined_at?: string | null
          left_at?: string | null
          duration_attended?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          joined_at?: string | null
          left_at?: string | null
          duration_attended?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendances_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_student_points: {
        Args: {
          student_id: string
        }
        Returns: number
      }
      get_course_progress: {
        Args: {
          student_id: string
          course_id: string
        }
        Returns: Json
      }
      check_achievements: {
        Args: {
          student_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      user_role: "admin" | "guardian" | "child" | "instructor"
      guardian_relationship: "father" | "mother" | "guardian" | "other"
      skill_level: "beginner" | "intermediate" | "advanced" | "expert"
      age_group: "6-8" | "9-11" | "12-14" | "15-18"
      course_category: "programming_basics" | "game_development" | "web_development" | "app_development" | "robotics" | "ai_ml" | "creative_coding"
      course_status: "draft" | "published" | "archived" | "cancelled"
      enrollment_status: "pending" | "active" | "completed" | "dropped" | "suspended"
      payment_status: "pending" | "paid" | "refunded" | "partial"
      lesson_type: "video" | "interactive" | "assignment" | "quiz" | "project" | "live_session"
      progress_status: "not_started" | "in_progress" | "completed" | "blocked"
      assignment_type: "coding_exercise" | "project" | "quiz" | "presentation" | "peer_review"
      submission_status: "draft" | "submitted" | "graded" | "returned_for_revision" | "accepted"
      achievement_type: "milestone" | "streak" | "points" | "skill" | "social" | "course_completion"
      point_transaction_type: "earned" | "spent" | "bonus" | "penalty" | "refund"
      project_type: "game" | "website" | "app" | "animation" | "robot" | "other"
      review_type: "teaching_methods" | "instructor" | "overall_experience" | "course_content"
      review_status: "pending" | "approved" | "rejected" | "featured"
      notification_type: "assignment" | "grade" | "announcement" | "reminder" | "achievement" | "session" | "payment"
      session_status: "scheduled" | "live" | "ended" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">]

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
      user_role: ["admin", "guardian", "child", "instructor"],
      guardian_relationship: ["father", "mother", "guardian", "other"],
      skill_level: ["beginner", "intermediate", "advanced", "expert"],
      age_group: ["6-8", "9-11", "12-14", "15-18"],
      course_category: [
        "programming_basics",
        "game_development",
        "web_development",
        "app_development",
        "robotics",
        "ai_ml",
        "creative_coding"
      ],
      course_status: ["draft", "published", "archived", "cancelled"],
      enrollment_status: ["pending", "active", "completed", "dropped", "suspended"],
      payment_status: ["pending", "paid", "refunded", "partial"],
      lesson_type: ["video", "interactive", "assignment", "quiz", "project", "live_session"],
      progress_status: ["not_started", "in_progress", "completed", "blocked"],
      assignment_type: ["coding_exercise", "project", "quiz", "presentation", "peer_review"],
      submission_status: ["draft", "submitted", "graded", "returned_for_revision", "accepted"],
      achievement_type: ["milestone", "streak", "points", "skill", "social", "course_completion"],
      point_transaction_type: ["earned", "spent", "bonus", "penalty", "refund"],
      project_type: ["game", "website", "app", "animation", "robot", "other"],
      review_type: ["teaching_methods", "instructor", "overall_experience", "course_content"],
      review_status: ["pending", "approved", "rejected", "featured"],
      notification_type: ["assignment", "grade", "announcement", "reminder", "achievement", "session", "payment"],
      session_status: ["scheduled", "live", "ended", "cancelled"]
    },
  },
} as const