import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Get initial session
  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        setState({
          user: session?.user ?? null,
          loading: false,
          error: null,
        })
      } catch (err) {
        setState({
          user: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to get session',
        })
      }
    }

    getSession()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        error: null,
      })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Sign up function
  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        setState({
          user: data.user ?? null,
          loading: false,
          error: null,
        })

        return { data, error: null }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to sign up'
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return { data: null, error: errorMessage }
      }
    },
    []
  )

  // Sign in function
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setState({
          user: data.user ?? null,
          loading: false,
          error: null,
        })

        return { data, error: null }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to sign in'
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return { data: null, error: errorMessage }
      }
    },
    []
  )

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setState({
        user: null,
        loading: false,
        error: null,
      })

      return { error: null }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign out'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return { error: errorMessage }
    }
  }, [])

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    isAuthenticated: state.user !== null,
  }
}
