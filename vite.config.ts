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
      includeAssets: ['icons/favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Fruity - Australian Fruit Seasons',
        short_name: 'Fruity',
        description: 'Quick reference for fruit seasonality in Australia',
        // DESIGN.md: paper is the app's real background, so the splash and status bar match it
        theme_color: '#F6F0E4',
        background_color: '#F6F0E4',
        display: 'standalone',
        id: '/Fruity/',
        start_url: '/Fruity/',
        scope: '/Fruity/',
        // PNG only: iOS cannot use an SVG home-screen icon and shows a letter placeholder instead.
        // Built by scripts/build-icons.ts (DESIGN.md "App icon").
        icons: [
          { src: '/Fruity/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache every fruit image and icon (about 3 MB) and the two fonts: at the shops an unvisited
        // detail page must still show its photo offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}', 'images/fruits/*.webp'],
        // The Fruit Salad Cafe's 3D bowl (three + Rapier physics, about 1.1 MB gzipped) is not
        // precached for everyone: it is cached the first time the game opens, then works offline.
        globIgnores: ['**/BowlScene-*.js'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/BowlScene-[\w-]+\.js$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'fruity-cafe-3d', expiration: { maxEntries: 2 } }
          }
        ]
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
