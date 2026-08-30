import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Home } from './pages/Home'
import { Admin } from './pages/Admin'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
