import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'

function App() {
  const [health, setHealth] = useState<string>('checking...')
  useEffect(() => {
    fetch('http://localhost:8080/health', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setHealth(d.ok ? 'ok' : 'error'))
      .catch(() => setHealth('error'))
  }, [])

  return <Navigate to="/prompts" replace />
}

export default App
