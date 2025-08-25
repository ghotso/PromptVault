import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Icon } from './icons'
import { CustomIcon } from './CustomIcon'
import { api } from '../lib/api'
import { LogIn, UserPlus } from 'lucide-react'

interface LoginPromptProps {
  title?: string
  message?: string
  showRegistration?: boolean
}

export default function LoginPrompt({ 
  title = "Authentication Required", 
  message = "Please sign in to access this page",
  showRegistration = true 
}: LoginPromptProps) {
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        setIsLoadingSettings(true)
        const response = await api<{ allowRegistration: boolean }>('/settings')
        setAllowRegistration(response.allowRegistration)
      } catch (error) {
        console.error('Failed to check registration settings:', error)
        setAllowRegistration(true) // Default to allowing on error
      } finally {
        setIsLoadingSettings(false)
      }
    }
    checkRegistration()
  }, [])

  // Only show registration if both props allow it AND backend settings allow it
  const shouldShowRegistration = showRegistration && allowRegistration

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-primary to-surface-secondary p-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-primary/10 rounded-3xl mb-8">
          <CustomIcon type="icon" size={48} className="text-accent-primary" />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {title}
        </h1>
        
        {/* Message */}
        <p className="text-muted-foreground text-xl mb-10 leading-relaxed">
          {message}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/auth"
            className="btn-primary flex items-center justify-center gap-3 h-14 text-lg font-medium"
          >
            <Icon icon={LogIn} size={22} color="rgb(13 27 42)" />
            Sign In
          </Link>
          
          {shouldShowRegistration && (
            <Link
              to="/auth?register=true"
              className="btn-outline flex items-center justify-center gap-3 h-14 text-lg font-medium"
            >
              <Icon icon={UserPlus} size={22} />
              Create Account
            </Link>
          )}
        </div>

        {/* About Link */}
        <div className="mt-8">
          <a 
            href="/about" 
            className="text-accent-primary hover:text-accent-secondary transition-colors duration-200 text-base underline decoration-dotted underline-offset-4"
          >
            Learn more about PromptVault
          </a>
        </div>

        {/* Show message when registration is disabled */}
        {!shouldShowRegistration && !isLoadingSettings && (
          <div className="mt-8 p-5 bg-surface-secondary border border-border-primary rounded-xl">
            <p className="text-base text-muted-foreground">
              Public registration is currently disabled. Please contact an administrator for access.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
