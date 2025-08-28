import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from './lib/api'
import { useAuth } from './lib/auth'

function App() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useAuth()

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${window.location.protocol}//${window.location.host}/health`)
        if (response.ok) {
          setIsHealthy(true)
        } else {
          setIsHealthy(false)
        }
      } catch (error) {
        setIsHealthy(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkHealth()
  }, [])

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Checking system health...</p>
      </div>
    </div>
  }

  if (!isHealthy) {
    return <Navigate to="/auth" replace />
  }

  // If user is logged in, go to prompts, otherwise go to auth
  if (user) {
    return <Navigate to="/prompts" replace />
  } else {
    return <Navigate to="/auth" replace />
  }
}

export default App
