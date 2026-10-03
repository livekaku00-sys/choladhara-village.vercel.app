import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Home } from './pages/Home'

// Admin is only used by volunteers, so keep it out of the main bundle.
const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })))

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                    <Admin />
                  </Suspense>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
