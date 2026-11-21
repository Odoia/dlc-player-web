import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api, ApiError } from '../api/client'
import { Card } from '../components/ui'

type ServerStats = {
  server_id: string
  name: string
  kills: number
  deaths: number
  kd: number
  playtime_seconds: number
  playtime_hours: number
  sessions: number
}

type StatsResponse = { servers: ServerStats[] }

const fmt = (n: number) => n.toLocaleString('pt-BR')

function discordNotice(): string {
  const v = new URLSearchParams(window.location.search).get('discord')
  if (v === 'ok') return 'Discord conectado e verificado ✓'
  if (v === 'taken') return 'Esse Discord ja esta vinculado a outra conta.'
  if (v === 'login_required') return 'Entre com a Steam antes de conectar o Discord.'
  return ''
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-100">{value}</p>
    </Card>
  )
}

export default function Dashboard() {
  const { user, logout, connectDiscord, unlinkDiscord } = useAuth()
  const notice = discordNotice()
  const [servers, setServers] = useState<ServerStats[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<StatsResponse>('/me/stats')
      .then((d) => {
        const list = d.servers ?? []
        setServers(list)
        if (list.length) setSelectedId(list[0].server_id)
      })
      .catch((e) =>
        setError(
          e instanceof ApiError
            ? 'Estatisticas indisponiveis no momento.'
            : 'Erro ao carregar as estatisticas.',
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  const selected = servers.find((s) => s.server_id === selectedId) ?? null

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

      {notice && (
        <p className="mb-4 rounded-lg border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-300">
          {notice}
        </p>
      )}

      {/* Discord: vinculo (verificado) com o SteamID */}
      <Card className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-200">Discord</p>
          {user.discord_linked ? (
            <p className="truncate text-xs text-neutral-500">
              <span className="text-green-400">✓ verificado</span>
              {user.discord_username ? ` · @${user.discord_username}` : ''}
            </p>
          ) : (
            <p className="text-xs text-neutral-500">
              Nao conectado — vincule pra ganhar honra por voz.
            </p>
          )}
        </div>
        {user.discord_linked ? (
          <button
            type="button"
            onClick={() => void unlinkDiscord()}
            className="shrink-0 rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 transition hover:bg-neutral-800"
          >
            Desconectar
          </button>
        ) : (
          <button
            type="button"
            onClick={connectDiscord}
            className="shrink-0 rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-pink-500"
          >
            Conectar Discord
          </button>
        )}
      </Card>

      {loading && <p className="text-neutral-500">Carregando...</p>}

      {!loading && error && (
        <Card>
          <p className="text-sm text-neutral-400">{error}</p>
        </Card>
      )}

      {!loading && !error && servers.length === 0 && (
        <Card>
          <p className="text-sm text-neutral-400">Ainda sem estatisticas registradas.</p>
        </Card>
      )}

      {!loading && !error && servers.length > 0 && (
        <>
          {/* Seletor de servidor (so aparece se jogou em mais de um) */}
          {servers.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {servers.map((s) => (
                <button
                  key={s.server_id}
                  type="button"
                  onClick={() => setSelectedId(s.server_id)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    s.server_id === selectedId
                      ? 'bg-pink-600 text-white'
                      : 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {selected && (
            <>
              <h2 className="mb-3 text-sm font-medium text-neutral-400">
                Estatisticas em <span className="text-neutral-200">{selected.name}</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard label="Abates" value={fmt(selected.kills)} />
                <StatCard label="Mortes" value={fmt(selected.deaths)} />
                <StatCard label="K/D" value={selected.kd.toLocaleString('pt-BR')} />
                <StatCard label="Horas jogadas" value={fmt(selected.playtime_hours)} />
                <StatCard label="Sessoes" value={fmt(selected.sessions)} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
