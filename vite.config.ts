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
        // DESIGN.md: paper is the app's real background, so the splash and status bar match it
        theme_color: '#F6F0E4',
        background_color: '#F6F0E4',
        display: 'standalone',
        start_url: '/Fruity/',
        icons: [
          { src: '/Fruity/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        // Precache every fruit image and icon (about 3 MB) and the two fonts: at the shops an unvisited
        // detail page must still show its photo offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}', 'images/fruits/*.webp']
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
