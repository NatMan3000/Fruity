import './pwa-update'

// Stale-chunk recovery (~/.claude/reference/pwa/mobile-pwa-standard.md): after a deploy, a page still
// running the old build can ask for a lazy chunk (3D, quiz, cafe, cook) that the new deploy deleted.
// Reload once to pick up the new build; the 10 s guard stops a reload loop if the chunk is really gone.
window.addEventListener('vite:preloadError', event => {
  const last = Number(sessionStorage.getItem('fruity.chunkReload') ?? 0)
  if (Date.now() - last < 10_000) return
  sessionStorage.setItem('fruity.chunkReload', String(Date.now()))
  event.preventDefault()
  window.location.reload()
})
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installUnlock } from './audio/sound'
import { installWelcome } from './hooks/useWelcome'

installUnlock() // the first tap anywhere lets iOS start sound (src/audio/sound.ts)
installWelcome() // every launch opens on the welcome screen, and every return from the background (src/components/Welcome.tsx)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
