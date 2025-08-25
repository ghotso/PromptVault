import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { Icon } from '../components/icons'
import { CustomIcon } from '../components/CustomIcon'
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Login() {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [allowRegistration, setAllowRegistration] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    // Check URL parameters for registration mode
    const urlParams = new URLSearchParams(window.location.search)
    const registerParam = urlParams.get('register')
    
    // Check if registration is allowed
    const checkRegistration = async () => {
      try {
        const response = await api<{ allowRegistration: boolean }>('/settings')
        setAllowRegistration(response.allowRegistration)
        
        // Set initial mode based on URL parameter and registration settings
        if (registerParam === 'true' && response.allowRegistration) {
          setMode('register')
        } else if (!response.allowRegistration) {
          setMode('login')
        }
      } catch (error) {
        console.error('Failed to check registration settings:', error)
        // Default to allowing registration if we can't check
        setAllowRegistration(true)
        
        // Set initial mode based on URL parameter
        if (registerParam === 'true') {
          setMode('register')
        }
      }
    }
    
    checkRegistration()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name || undefined)
      }
      navigate('/prompts')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-primary to-surface-secondary p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-primary/10 rounded-3xl mb-8">
            <CustomIcon 
              type="icon" 
              size={48} 
              className="text-accent-primary" 
            />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground text-xl mb-6">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join PromptVault to start organizing your AI prompts'
            }
          </p>
          <div className="mt-6">
            <a 
              href="/about" 
              className="text-accent-primary hover:text-accent-secondary transition-colors duration-200 text-base underline decoration-dotted underline-offset-4"
            >
              Learn more about PromptVault
            </a>
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            {mode === 'register' && (
              <div>
                <label className="block text-base font-medium mb-4 text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <Icon icon={User} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    className="input pl-12 h-14 text-base" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-base font-medium mb-4 text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Icon icon={Mail} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  className="input pl-12 h-14 text-base" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-base font-medium mb-4 text-foreground">
                Password
              </label>
              <div className="relative">
                <Icon icon={Lock} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  className="input pl-12 pr-12 h-14 text-base" 
                  placeholder="Enter your password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon icon={showPassword ? EyeOff : Eye} size={20} />
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-5 bg-error/10 border border-error/20 rounded-xl text-error text-base">
                {error}
              </div>
            )}
            
            <button 
              className="btn-primary w-full flex items-center justify-center gap-3 h-14 text-lg font-medium mt-8" 
              type="submit"
              disabled={isLoading}
            >
              <Icon icon={mode === 'login' ? LogIn : UserPlus} size={22} color="rgb(13 27 42)" />
              {isLoading 
                ? 'Please wait...' 
                : mode === 'login' 
                  ? 'Sign In' 
                  : 'Create Account'
              }
            </button>
          </form>
        </div>

        {/* Mode Toggle */}
        {allowRegistration && (
          <div className="text-center mt-10">
            <button 
              className="text-accent-primary hover:text-accent-primary/80 transition-colors font-medium text-xl" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        )}
        
        {!allowRegistration && mode === 'login' && (
          <div className="text-center mt-10">
            <p className="text-base text-muted-foreground">
              Public registration is currently disabled. Please contact an administrator for access.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


