import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

/**
 * Check if the user is currently authenticated
 * @returns Promise<boolean> - true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && user !== null
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

/**
 * Get the current authenticated user
 * @returns Promise<User | null> - the current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Get the current session
 * @returns Promise<Session | null> - the current session or null if not authenticated
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Sign out the current user
 * @returns Promise<boolean> - true if sign out was successful, false otherwise
 */
export async function signOut(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error signing out:', error)
    return false
  }
}
