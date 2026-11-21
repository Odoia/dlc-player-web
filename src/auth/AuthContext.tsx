import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, logoutRequest, steamLoginUrl } from '../api/client'

export type User = {
  id: number
  steam_id: string
  name: string | null
  avatar_url: string | null
  profile_url: string | null
}

type AuthValue = {
  user: User | null
  ready: boolean
  loginWithSteam: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const Ctx = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .get<User>('/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  // Login = navegacao pro OmniAuth-Steam; o retorno cai de volta no portal com sessao.
  function loginWithSteam() {
    window.location.href = steamLoginUrl()
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
    }
  }

  async function refreshUser() {
    setUser(await api.get<User>('/me'))
  }

  return (
    <Ctx value={{ user, ready, loginWithSteam, logout, refreshUser }}>{children}</Ctx>
  )
}

export function useAuth(): AuthValue {
  const value = useContext(Ctx)
  if (!value) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return value
}
