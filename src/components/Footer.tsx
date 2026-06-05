import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} HCC. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
