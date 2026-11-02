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
      includeAssets: ['icons/favicon.svg', 'icons/apple-touch-icon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Fruity - Australian Fruit Seasons',
        short_name: 'Fruity',
        description: 'Quick reference for fruit seasonality in Australia',
        // DESIGN.md: the splash and first status bar are spring's raspberry sorbet; the app then sets
        // the current season's (or fruit's) colour on theme-color as you move about
        theme_color: '#B7014E',
        background_color: '#B7014E',
        display: 'standalone',
        start_url: '/Fruity/',
        scope: '/Fruity/',
        // Mirrors Bready's manifest, which gets its home-screen icon on Nathan's iPhone: no `id`,
        // relative SVG icons only (192, 512, 512 maskable). PNG icons and an `id` coincided with iOS
        // showing a letter placeholder instead (2 Nov 2026).
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache the fruit stickers, the two fonts and the 3D hero (three.js): at the shops an unvisited
        // fruit page must still show its art offline, and Now's dish must still drop in. The old 4:3
        // photos and round icons (<id>-480/-960/-icon.webp) are no longer drawn, so they are left out.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}', 'images/fruits/*-sticker*.webp'],
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
