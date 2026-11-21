import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, discordConnectUrl, logoutRequest, steamLoginUrl } from '../api/client'

export type User = {
  id: number
  steam_id: string
  name: string | null
  avatar_url: string | null
  profile_url: string | null
  discord_username: string | null
  discord_linked: boolean
  voice_seconds: number
  pending_honra: number
  claimed_honra: number
  honra_lifetime: number
}

type AuthValue = {
  user: User | null
  ready: boolean
  loginWithSteam: () => void
  connectDiscord: () => void
  unlinkDiscord: () => Promise<void>
  redeemHonra: () => Promise<number>
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

  // Conectar/verificar Discord (ja logado por Steam) — navegacao top-level pro OAuth.
  function connectDiscord() {
    window.location.href = discordConnectUrl()
  }

  async function unlinkDiscord() {
    setUser(await api.del<User>('/me/discord'))
  }

  // Resgata TODA a honra pendente (zera). Retorna quanto foi resgatado.
  async function redeemHonra(): Promise<number> {
    const res = await api.post<User & { redeemed: number }>('/me/redeem')
    setUser(res)
    return res.redeemed
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
    <Ctx
      value={{
        user,
        ready,
        loginWithSteam,
        connectDiscord,
        unlinkDiscord,
        redeemHonra,
        logout,
        refreshUser,
      }}
    >
      {children}
    </Ctx>
  )
}

export function useAuth(): AuthValue {
  const value = useContext(Ctx)
  if (!value) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return value
}
