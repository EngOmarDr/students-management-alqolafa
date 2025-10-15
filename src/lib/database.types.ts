export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          student_name: string
          birth_date: string
          residence: string
          nationality: string
          guardian_name: string
          previous_courses: string
          quran_memorized: string
          computer_proficiency: boolean
          certificate: string
          family_status: string
          books_read: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_name: string
          birth_date: string
          residence: string
          nationality: string
          guardian_name: string
          previous_courses?: string
          quran_memorized: string
          computer_proficiency?: boolean
          certificate?: string
          family_status: string
          books_read?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_name?: string
          birth_date?: string
          residence?: string
          nationality?: string
          guardian_name?: string
          previous_courses?: string
          quran_memorized?: string
          computer_proficiency?: boolean
          certificate?: string
          family_status?: string
          books_read?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
