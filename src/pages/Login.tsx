import { useAuth } from '../auth/AuthContext'
import { env } from '../config/env'
import { Card } from '../components/ui'

function loginFailed(): boolean {
  return new URLSearchParams(window.location.search).get('login') === 'fail'
}

export default function Login() {
  const { loginWithSteam } = useAuth()
  const error = loginFailed() ? 'Nao foi possivel entrar com a Steam. Tenta de novo.' : ''

  return (
    <div className="mx-auto mt-24 w-full max-w-sm px-4 text-center">
      <h1 className="mb-2 text-2xl font-semibold">{env.appName}</h1>
      <p className="mb-6 text-sm text-neutral-400">
        Entre com a Steam pra ver suas estatisticas e honra no servidor.
      </p>
      <Card>
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="button"
          onClick={loginWithSteam}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b2838] px-4 py-3 font-medium text-white transition hover:bg-[#2a475e]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-9.96 9.17l5.37 2.22a2.83 2.83 0 0 1 1.6-.5l2.39-3.47v-.05a3.78 3.78 0 1 1 3.78 3.78h-.09l-3.41 2.44c0 .03 0 .06 0 .08a2.84 2.84 0 0 1-5.65.4L2.2 14.96A10 10 0 1 0 12 2Zm-3.3 15.17-1.23-.51a2.13 2.13 0 0 0 3.93-1.63 2.13 2.13 0 0 0-2.76-1.24l1.27.53a1.57 1.57 0 1 1-1.2 2.9Zm9.08-7.4a2.52 2.52 0 1 0-2.52 2.52 2.52 2.52 0 0 0 2.52-2.52Zm-4.41 0a1.9 1.9 0 1 1 1.9 1.9 1.9 1.9 0 0 1-1.9-1.9Z" />
          </svg>
          Entrar com Steam
        </button>
      </Card>
      <p className="mt-6 text-xs text-neutral-600">
        Usamos so a Steam pra identificar voce no servidor. Nada de senha.
      </p>
    </div>
  )
}
