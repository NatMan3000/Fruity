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
        id: '/Fruity/',
        start_url: '/Fruity/',
        scope: '/Fruity/',
        // PNG only: iOS cannot use an SVG home-screen icon and shows a letter placeholder instead.
        // Built by scripts/build-icons.ts (DESIGN.md "App icon").
        // SVG icons first: the pre-rebuild app listed only SVG icons here and iOS used them for the
        // home-screen icon; after switching to PNG-only, iOS showed a letter placeholder (Nathan, 2 Nov 2026).
        icons: [
          { src: '/Fruity/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: '/Fruity/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/Fruity/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
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
