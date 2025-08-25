import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { designTokens, type ColorMode } from './design-tokens'

interface ThemeContextType {
  colorMode: ColorMode
  toggleColorMode: () => void
  setColorMode: (mode: ColorMode) => void
  tokens: typeof designTokens
  currentColors: typeof designTokens.colors.light
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptvault-theme')
      if (saved === 'light' || saved === 'dark') {
        return saved
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    return 'light'
  })

  useEffect(() => {
    localStorage.setItem('promptvault-theme', colorMode)
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
  }, [colorMode])

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  const currentColors = designTokens.colors[colorMode] as typeof designTokens.colors.light

  return (
    <ThemeContext.Provider value={{
      colorMode,
      toggleColorMode,
      setColorMode,
      tokens: designTokens,
      currentColors,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
