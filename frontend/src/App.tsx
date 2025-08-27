import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from './lib/api'

function App() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api('/health')
        setIsHealthy(true)
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

  // Always redirect to /prompts - logged in users see their prompts, 
  // non-logged in users see the login prompt
  return <Navigate to="/prompts" replace />
}

export default App
