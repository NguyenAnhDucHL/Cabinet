import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const backendTarget = process.env.VITE_BACKEND_URL || 'http://localhost:59609'

export default defineConfig({
  publicDir: '../wwwroot',
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        skipWaiting: true,
        clientsClaim: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Phòng họp không giấy tờ',
        short_name: 'Phòng họp không giấy tờ',
        description: 'Phòng họp không giấy tờ',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/assets/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': backendTarget,
      '/notificationHub': {
        target: backendTarget,
        ws: true,
      },
      '/Uploads': backendTarget,
      '/partials': backendTarget,
      '/sw.js': backendTarget,
    },
  },
  build: {
    outDir: '../wwwroot',
    emptyOutDir: false,
    assetsDir: 'vite-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
    },
  },
})
