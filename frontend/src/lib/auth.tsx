import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

type User = { id: string; email: string; name?: string | null; team?: string | null; role?: 'ADMIN'|'USER' } | null

type AuthCtx = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ user: User }>("/auth/me").then(r => setUser(r.user)).finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const u = await api<{ id: string; email: string; name?: string }>("/auth/login", { method: 'POST', body: JSON.stringify({ email, password }) })
    setUser(u)
  }
  async function register(email: string, password: string, name?: string) {
    const u = await api<{ id: string; email: string; name?: string }>("/auth/register", { method: 'POST', body: JSON.stringify({ email, password, name }) })
    setUser(u)
  }
  async function logout() {
    await api("/auth/logout", { method: 'POST' })
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}


