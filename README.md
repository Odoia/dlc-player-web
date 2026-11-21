# dlc-player-web

Portal do **jogador** do ecossistema dlc (DayZ "v3"). Front do `dlc-player-api`.

> Login **somente Steam**. O jogador entra com a conta Steam, vê suas estatísticas e (depois) sua honra. Produto separado do painel do **dono do server** (`dlc-platform-web`).

## Stack

- **React 19 + Vite 8 + TypeScript** · **Tailwind 4** · **react-router 8**
- PWA (`vite-plugin-pwa`) · oxlint · vitest
- Build estático servido por **nginx** (Kaniko + Argo, igual os irmãos)
- Mesmo design system (tema dark/rosa, `src/components/ui.tsx`)

## Fluxo

1. `/login` → botão **"Entrar com Steam"** → navega pra `${VITE_API_URL}/auth/steam`.
2. OmniAuth-Steam autentica e volta pro portal com a sessão (cookie httpOnly).
3. `/` (dashboard, protegido) → mostra o jogador + estatísticas vindas de `GET /api/v1/me/stats`.

## Rodando local

```bash
mise install          # node
cp .env.example .env   # VITE_API_URL=http://localhost:3000 (a dlc-player-api)
npm install
npm run dev            # http://localhost:5173
```

A `dlc-player-api` precisa estar de pé (porta 3000) com `CORS_ORIGINS` incluindo `http://localhost:5173` e `WEB_APP_URL=http://localhost:5173`.

## Config

- `VITE_API_URL` — host da `dlc-player-api` (o login Steam é navegação top-level pra ele).
- `VITE_APP_NAME` — título exibido.

> No build de produção o `VITE_API_URL` é **baked** no Dockerfile (ajustar pro host real da player-api).
