import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
  searchQuery: string
  setSearchQuery: (query: string) => void
  currentRoute: string
  onNavigate: (route: string) => void
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  searchQuery,
  setSearchQuery,
  currentRoute,
  onNavigate
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-150 transition-colors duration-300">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentRoute={currentRoute}
        onNavigate={onNavigate}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
