import React, { createContext, useContext, useState, useEffect } from 'react'

export type ChordAlignment = 'left' | 'center' | 'right'
export type AppTheme = 'light' | 'dark'

interface PersonalizationContextProps {
  fontSize: number
  alignChords: ChordAlignment
  transpose: number
  theme: AppTheme
  setFontSize: (size: number) => void
  setAlignChords: (alignment: ChordAlignment) => void
  setTranspose: (steps: number) => void
  setTheme: (theme: AppTheme) => void
  toggleTheme: () => void
}

const PersonalizationContext = createContext<PersonalizationContextProps | undefined>(undefined)

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('font_size')
    return saved ? parseInt(saved, 10) : 18
  })

  const [alignChords, setAlignChordsState] = useState<ChordAlignment>(() => {
    const saved = localStorage.getItem('align_chords')
    return (saved as ChordAlignment) || 'left'
  })

  const [transpose, setTransposeState] = useState<number>(() => {
    const saved = localStorage.getItem('transpose')
    return saved ? parseInt(saved, 10) : 0
  })

  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved as AppTheme
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Sync theme with DOM document class
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const setFontSize = (size: number) => {
    setFontSizeState(size)
    localStorage.setItem('font_size', size.toString())
  }

  const setAlignChords = (alignment: ChordAlignment) => {
    setAlignChordsState(alignment)
    localStorage.setItem('align_chords', alignment)
  }

  const setTranspose = (steps: number) => {
    setTransposeState(steps)
    localStorage.setItem('transpose', steps.toString())
  }

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <PersonalizationContext.Provider
      value={{
        fontSize,
        alignChords,
        transpose,
        theme,
        setFontSize,
        setAlignChords,
        setTranspose,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  )
}

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext)
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider')
  }
  return context
}
