import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Fruity/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg'],
      manifest: {
        name: 'Fruity - Australian Fruit Seasons',
        short_name: 'Fruity',
        description: 'Quick reference for fruit seasonality in Australia',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/Fruity/',
        icons: [
          { src: '/Fruity/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        // Precache every fruit image (about 3.3 MB): at the shops an unvisited detail page must still show its photo offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}', 'images/fruits/*.webp']
      }
    })
  ],
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts']
  },
  server: {
    host: true // Expose to network for mobile testing
  }
})
