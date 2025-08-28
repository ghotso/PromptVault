import { Icon as LucideIcon } from 'lucide-react'
import { useTheme } from '../lib/theme'

interface ThemeIconProps {
  icon: any
  size?: number
  className?: string
  variant?: 'primary' | 'secondary' | 'on-bg'
}

export function ThemeIcon({ icon: Icon, size = 24, className = '', variant = 'primary' }: ThemeIconProps) {
  const { colorMode } = useTheme()
  
  const getIconColor = () => {
    if (variant === 'on-bg') {
      return colorMode === 'light' ? 'rgb(13 27 42)' : 'rgb(13 27 42)'
    }
    
    if (variant === 'secondary') {
      return colorMode === 'light' ? 'rgb(76 201 240)' : 'rgb(76 201 240)'
    }
    
    // primary variant
    return colorMode === 'light' ? 'rgb(0 3 112)' : 'rgb(198 247 40)'
  }
  
  return <Icon size={size} color={getIconColor()} className={className} />
}
