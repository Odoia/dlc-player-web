// Config do front. apiUrl = host da dlc-player-api. Em dev default localhost:3000
// (o login Steam e navegacao top-level pra esse host, nao dah pra usar proxy).
export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'Portal do Jogador',
  apiUrl: (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3000').replace(/\/$/, ''),
}
