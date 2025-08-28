import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { ThemeToggle } from './ThemeToggle'
import { Icon } from './icons'
import { CustomIcon } from './CustomIcon'
import { useEffect, useState } from 'react'
import {
  MessageSquare,
  Users,
  Settings,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Info,
} from 'lucide-react'

export function Nav() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    // Check if registration is allowed
    const checkRegistration = async () => {
      try {
        setIsLoadingSettings(true)
        const response = await fetch(`${window.location.protocol}//${window.location.host}/settings`)
        const data = await response.json()
        setAllowRegistration(data.allowRegistration)
      } catch (error) {
        console.error('Failed to check registration settings:', error)
        // Default to allowing registration if we can't check
        setAllowRegistration(true)
      } finally {
        setIsLoadingSettings(false)
      }
    }
    
    checkRegistration()
  }, [])

  const navItems = [
    { path: '/prompts', label: 'Prompts', icon: MessageSquare },
    { path: '/team-feed', label: 'Team Feed', icon: Users },
    ...(user && (user as any).role === 'ADMIN' ? [{ path: '/admin', label: 'Admin', icon: Settings }] : []),
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border-primary/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-accent-primary-on-bg shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
                <CustomIcon type="icon" size={20} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                PromptVault
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-accent-primary text-accent-primary-on-bg shadow-md hover:shadow-lg transform hover:scale-105'
                    : 'text-accent-primary hover:text-accent-primary/80 hover:bg-surface-secondary hover:shadow-sm'
                }`}
              >
                                 <Icon icon={item.icon} size={16} variant={isActive(item.path) ? 'on-bg' : 'primary'} />
                {item.label}
              </Link>
            ))}
            
            {/* About Link - Always Visible */}
                         <Link
               to="/about"
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                 isActive('/about')
                   ? 'bg-accent-primary text-accent-primary-on-bg shadow-md hover:shadow-lg transform hover:scale-105'
                   : 'text-accent-primary hover:text-accent-primary/80 hover:bg-surface-secondary hover:shadow-sm'
               }`}
             >
               <Icon icon={Info} size={16} variant={isActive('/about') ? 'on-bg' : 'primary'} />
               About
             </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
                         <Link
               to="/about"
               className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                 isActive('/about')
                   ? 'bg-accent-primary text-accent-primary-on-bg shadow-md'
                   : 'text-accent-primary hover:text-accent-primary/80 hover:bg-surface-secondary'
               }`}
             >
               <Icon icon={Info} size={16} variant={isActive('/about') ? 'on-bg' : 'primary'} />
             </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-2">
                                 <Link
                   to="/account"
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                     isActive('/account')
                       ? 'bg-accent-primary text-accent-primary-on-bg shadow-md hover:shadow-lg transform hover:scale-105'
                       : 'text-accent-primary hover:text-accent-primary/80 hover:bg-surface-secondary hover:shadow-sm'
                   }`}
                 >
                   <Icon icon={User} size={16} variant={isActive('/account') ? 'on-bg' : 'primary'} />
                   <span className="hidden sm:inline">Account</span>
                 </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-secondary hover:shadow-sm transition-all duration-200"
                >
                  <Icon icon={LogOut} size={16} className="text-muted-foreground" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-secondary hover:shadow-sm transition-all duration-200"
                >
                  <Icon icon={LogIn} size={16} className="text-muted-foreground" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                {!isLoadingSettings && allowRegistration && (
                  <Link
                    to="/auth?register=true"
                    className="btn-primary bg-accent-primary hover:bg-accent-primary shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Icon icon={UserPlus} size={16} variant="on-bg" />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


