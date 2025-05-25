import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Gestión de Productos',
        short_name: 'Gossipey',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#d19a02',
        icons: [
          {
            src: 'iconos/192gossipey.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/512gossipey.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})