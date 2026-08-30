import React, { ReactNode, ErrorInfo } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorCount: number
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorCount: 0 }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 1 }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error)
    console.error('Error info:', errorInfo)

    // Log to error tracking service (when Sentry is integrated)
    if (import.meta.env.VITE_SENTRY_DSN) {
      console.log('Error would be logged to Sentry in production')
    }

    // Increment error count
    this.setState((state) => ({
      errorCount: state.errorCount + 1,
    }))
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Don't keep retrying after multiple errors
      if (this.state.errorCount > 3) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full bg-slate-900/80 border border-red-800/40 rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Application Error
              </h2>
              <p className="text-slate-300 mb-6">
                Something went wrong and the application cannot recover. Please contact support or try again later.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium transition"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-100 font-medium transition"
                >
                  Reload Page
                </button>
              </div>
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs bg-slate-950/50 p-2 rounded overflow-auto text-red-400">
                  {this.state.error?.message}
                </pre>
              </details>
            </div>
          </div>
        )
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <div className="max-w-md w-full bg-slate-900/80 border border-red-800/40 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <AlertCircle className="w-12 h-12 text-red-400 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Oops! Something Went Wrong
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  The application encountered an unexpected error.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-300 font-mono break-words">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium transition"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-100 font-medium transition"
              >
                Go to Home
              </button>
            </div>

            {import.meta.env.DEV && (
              <details className="mt-6">
                <summary className="text-xs text-slate-400 cursor-pointer">
                  Developer Info
                </summary>
                <pre className="mt-2 text-xs bg-slate-950/50 p-2 rounded overflow-auto text-red-400">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
