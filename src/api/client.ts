import { env } from '../config/env'

// Cliente HTTP fino. Auth = sessao por cookie (httpOnly) -> credentials: 'include'.
// XHR vai pro prefixo /api/v1 da dlc-player-api.
export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    const msg =
      (body as { error?: string })?.error ||
      (body as { message?: string })?.message ||
      `HTTP ${status}`
    super(msg)
    this.status = status
    this.body = body
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${env.apiUrl}/api/v1${path}`, {
    method,
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!res.ok) throw new ApiError(res.status, data)
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
}

// Login Steam: navegacao top-level pro request-phase do OmniAuth (fora do /api/v1).
export function steamLoginUrl(): string {
  return `${env.apiUrl}/auth/steam`
}

// Logout: rota na raiz da API (DELETE /logout), encerra a sessao do cookie.
export async function logoutRequest(): Promise<void> {
  await fetch(`${env.apiUrl}/logout`, { method: 'DELETE', credentials: 'include' })
}

// Conectar/verificar Discord: navegacao top-level pro OAuth (fora do /api/v1).
export function discordConnectUrl(): string {
  return `${env.apiUrl}/auth/discord`
}
