/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Aposentado: o Cloudflare cacheia o sw.js (max-age 4h) e o SW ficava
      // servindo JS velho a cada deploy. selfDestroying gera um SW que se
      // desregistra + limpa o cache, curando os navegadores presos.
      selfDestroying: true,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'Portal do Jogador — Delicious',
        short_name: 'Portal',
        description: 'Suas estatisticas e honra no servidor DayZ Delicious.',
        lang: 'pt-BR',
        theme_color: '#0b0f14',
        background_color: '#0b0f14',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
