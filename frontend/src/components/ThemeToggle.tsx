import { useTheme } from '../lib/theme'
import { Icon } from './icons'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { colorMode, setColorMode } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border-primary shadow-sm">
      <button
        onClick={() => setColorMode('light')}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
          colorMode === 'light'
            ? 'bg-accent-primary text-accent-primary-on-bg shadow-md hover:shadow-lg transform hover:scale-105'
            : 'bg-surface-secondary text-foreground hover:bg-surface-tertiary hover:shadow-sm'
        }`}
        style={{ borderRadius: '8px' }}
        title="Light mode"
      >
        <Icon icon={Sun} size={16} variant={colorMode === 'light' ? 'on-bg' : 'primary'} />
      </button>
      
      <button
        onClick={() => setColorMode('dark')}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
          colorMode === 'dark'
            ? 'bg-accent-primary text-accent-primary-on-bg shadow-md hover:shadow-lg transform hover:scale-105'
            : 'bg-surface-secondary text-foreground hover:bg-surface-tertiary hover:shadow-sm'
        }`}
        style={{ borderRadius: '8px' }}
        title="Dark mode"
      >
        <Icon icon={Moon} size={16} variant={colorMode === 'dark' ? 'on-bg' : 'primary'} />
      </button>
    </div>
  )
}
