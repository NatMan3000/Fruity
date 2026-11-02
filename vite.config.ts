import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'

// iOS home-screen icon (2 Nov 2026): Safari's Add to Home Screen sheet has its own icon loader that
// can fail on a network URL, and then iOS shows a letter tile on the theme colour. The bookmark and
// app switcher still showed our icon, so the files were fine. Embedding the 180px PNG as a data: URI
// in the page head takes the network out of it (jwpriem/ecoflow PR #15). SVG touch icons are not used
// for the Home Screen at all (firt.dev/notes/pwa-ios), so this is a PNG.
function inlineTouchIcon(): Plugin {
  return {
    name: 'fruity-inline-touch-icon',
    transformIndexHtml(html) {
      const png = readFileSync(new URL('./public/icons/apple-touch-icon.png', import.meta.url)).toString('base64')
      return html.replace('<!--TOUCH-ICON-->', `<link rel="apple-touch-icon" sizes="180x180" href="data:image/png;base64,${png}" />`)
    }
  }
}

export default defineConfig({
  base: '/Fruity/',
  plugins: [
    react(),
    tailwindcss(),
    inlineTouchIcon(),
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
        // PNG first, cache-busted: iOS ranks icons by size and cannot use SVG for the Home Screen before
        // iOS 26 (firt.dev/notes/pwa-ios); `?v=4` skips any failed fetch iOS remembered.
        icons: [
          { src: 'icons/icon-192.png?v=4', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png?v=4', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png?v=4', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache the fruit stickers, the two fonts and the 3D hero (three.js): at the shops an unvisited
        // fruit page must still show its art offline, and Now's dish must still drop in. The studio
        // photos (<id>-photo-720.webp) are runtime-cached below instead.
        // Recipe dish photos: the 720 card size is precached (every card shows one); the 1200 heroes
        // are cached as each recipe is opened (below), and offline the hero falls back to its 720.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}', 'images/fruits/*-sticker*.webp', 'images/dishes/*-720.webp'],
        // The Fruit Salad Cafe's 3D bowl (three + Rapier physics, about 1.1 MB gzipped) is not
        // precached for everyone: it is cached the first time the game opens, then works offline.
        globIgnores: ['**/BowlScene-*.js'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/BowlScene-[\w-]+\.js$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'fruity-cafe-3d', expiration: { maxEntries: 2 } }
          },
          {
            urlPattern: ({ url }) => /\/images\/dishes\/[\w-]+-1200\.webp$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'fruity-dishes', expiration: { maxEntries: 40 } }
          },
          {
            // A fruit's studio photo shows only when its "More about it" is opened
            urlPattern: ({ url }) => /\/images\/fruits\/[\w-]+-photo-720\.webp$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'fruity-fruit-photos', expiration: { maxEntries: 45 } }
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
