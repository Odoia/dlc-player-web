import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api, ApiError } from '../api/client'
import { Card } from '../components/ui'

type Stats = Record<string, unknown>

// Rotulos amigaveis pras chaves que o ingest devolver (Fase 1: o que vier vira card).
const LABELS: Record<string, string> = {
  kills: 'Abates',
  deaths: 'Mortes',
  kd: 'K/D',
  playtime_hours: 'Horas jogadas',
  playtime_seconds: 'Tempo de jogo',
  honor: 'Honra',
  reputation: 'Reputacao',
}

function label(key: string): string {
  return LABELS[key] || key.replace(/_/g, ' ')
}

function fmt(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'number') return value.toLocaleString('pt-BR')
  return String(value)
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsError, setStatsError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Stats>('/me/stats')
      .then(setStats)
      .catch((e) =>
        setStatsError(
          e instanceof ApiError
            ? 'Estatisticas indisponiveis no momento.'
            : 'Erro ao carregar as estatisticas.',
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  const entries = stats ? Object.entries(stats) : []

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-center gap-4">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="h-14 w-14 rounded-full border border-neutral-700"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-neutral-800" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold">{user.name || 'Jogador'}</h1>
          <p className="text-xs text-neutral-500">SteamID {user.steam_id}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 transition hover:bg-neutral-800"
        >
          Sair
        </button>
      </header>

      <h2 className="mb-3 text-sm font-medium text-neutral-400">Suas estatisticas</h2>

      {loading && <p className="text-neutral-500">Carregando...</p>}

      {!loading && statsError && (
        <Card>
          <p className="text-sm text-neutral-400">{statsError}</p>
        </Card>
      )}

      {!loading && !statsError && entries.length === 0 && (
        <Card>
          <p className="text-sm text-neutral-400">Ainda sem estatisticas registradas.</p>
        </Card>
      )}

      {!loading && !statsError && entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {entries.map(([key, value]) => (
            <Card key={key} className="p-4">
              <p className="text-xs text-neutral-500 capitalize">{label(key)}</p>
              <p className="mt-1 text-2xl font-semibold text-neutral-100">{fmt(value)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
