import { useEffect, useState } from 'react'
import { PersonalizationProvider } from './context/PersonalizationContext'
import { Layout } from './components/Layout'
import { OptionsSidebar } from './components/OptionsSidebar'
import { Home } from './pages/Home'
import { ServiceList } from './pages/ServiceList'
import { AddSong } from './pages/AddSong'
import { EditSong } from './pages/EditSong'
import { ViewSong } from './pages/ViewSong'

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash || '#/')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (route: string) => {
    window.location.hash = route
  }

  // Route matching and page rendering logic
  const renderPage = () => {
    const route = currentRoute

    // Handle view-song route: #/view-song/:id
    if (route.startsWith('#/view-song/')) {
      const songId = route.substring('#/view-song/'.length)
      if (songId) {
        return <ViewSong songId={songId} onNavigate={navigate} />
      }
    }

    // Handle edit-song route: #/edit-song/:id
    if (route.startsWith('#/edit-song/')) {
      const songId = route.substring('#/edit-song/'.length)
      if (songId) {
        return <EditSong songId={songId} onNavigate={navigate} />
      }
    }

    // Static routes
    switch (route) {
      case '#/service-list':
        return <ServiceList onNavigate={navigate} />
      case '#/add-song':
        return <AddSong onNavigate={navigate} />
      case '#/':
      case '':
      default:
        return <Home searchQuery={searchQuery} onNavigate={navigate} />
    }
  }

  return (
    <Layout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentRoute={currentRoute}
      onNavigate={navigate}
    >
      {renderPage()}
      <OptionsSidebar />
    </Layout>
  )
}

function App() {
  return (
    <PersonalizationProvider>
      <AppContent />
    </PersonalizationProvider>
  )
}

export default App
