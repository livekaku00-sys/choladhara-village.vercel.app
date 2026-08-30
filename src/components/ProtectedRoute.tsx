import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'moderator' | 'user'
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
          <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-2">
              Access Denied
            </h2>
            <p className="text-slate-400 text-center mb-6">
              This page requires authentication. Please log in to continue.
            </p>
            <a
              href="/login"
              className="block w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium text-center transition"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    )
  }

  // TODO: Implement role-based access control
  // For now, just check if user is authenticated

  return <>{children}</>
}
