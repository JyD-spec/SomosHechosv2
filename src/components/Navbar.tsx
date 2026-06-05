import React from 'react'
import { usePersonalization } from '../context/PersonalizationContext'
import { ListMusic, PlusCircle, Sun, Moon, Search, Church } from 'lucide-react'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  currentRoute: string
  onNavigate: (route: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  currentRoute,
  onNavigate
}) => {
  const { theme, toggleTheme } = usePersonalization()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // If not on home, navigate to home to show search results
    if (currentRoute !== '' && currentRoute !== '#/') {
      window.location.hash = '#/'
    }
  }

  const linkClass = (route: string) => {
    const isActive = currentRoute === route || (route === '#/' && currentRoute === '')
    return `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="#/"
              onClick={() => onNavigate('#/')}
              className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-lime-600 dark:from-red-400 dark:to-yellow-400 bg-clip-text text-transparent"
            >
              <Church className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Hechos Comunidad Cristiana</span>
              <span className="sm:hidden">HCC</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <a href="#/" onClick={() => onNavigate('#/')} className={linkClass('#/')}>
              Inicio
            </a>
            <a href="#/service-list" onClick={() => onNavigate('#/service-list')} className={linkClass('#/service-list')}>
              <ListMusic className="w-4 h-4" />
              Listado de Servicio
            </a>
            <a href="#/add-song" onClick={() => onNavigate('#/add-song')} className={linkClass('#/add-song')}>
              <PlusCircle className="w-4 h-4" />
              Agregar Acordes
            </a>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
            <div className="relative max-w-xs w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar canciones..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              />
            </div>

            {/* Mobile Nav Links Icon-Only or Hamburger can go here, but simple icon list is great for mobile */}
            <div className="flex md:hidden items-center gap-1">
              <a
                href="#/service-list"
                onClick={() => onNavigate('#/service-list')}
                title="Listado de Servicio"
                className={`p-2 rounded-full ${currentRoute === '#/service-list'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
              >
                <ListMusic className="w-5 h-5" />
              </a>
              <a
                href="#/add-song"
                onClick={() => onNavigate('#/add-song')}
                title="Agregar Acordes"
                className={`p-2 rounded-full ${currentRoute === '#/add-song'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
              >
                <PlusCircle className="w-5 h-5" />
              </a>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
