import { supabase } from './supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: 'safety_officer' | 'facility_manager' | 'approver' | 'admin'
  phone?: string
  profile_picture_url?: string
}

export const authService = {
  async signUp(email: string, password: string, fullName: string, role: string) {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })

    if (signUpError) throw signUpError

    if (authData.user) {
      // Create user profile in public.users table
      const { error: profileError } = await supabase.from('users').insert([
        {
          auth_id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
          role: role,
        },
      ])

      if (profileError) throw profileError
    }

    return authData
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return null

    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return userProfile as AuthUser
  },

  onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null)
    })

    return subscription
  },
}
