import { useSyncExternalStore } from 'react'
import { parseRoute } from '../utils/route'
import { resetToNow } from './useRoute'
import { welcomeOnHide, welcomeOnReturn } from '../utils/welcome'

// Whether the welcome screen is up (src/components/Welcome.tsx, DESIGN.md "Welcome"). It shows on every
// launch and on every return from the background (src/utils/welcome.ts says when), over whatever screen
// is there; that screen stays mounted underneath, as it was. Three states: `showing` (waiting for the
// tap), `leaving` (cut open, the halves flying apart) and `gone`.
//
// While it is not gone, the 3D heroes wait (useAfterPaint in useLazy3D.ts): the Now bowl must drop, and
// be heard, only once the screen under it can be seen. And while it is showing, the screen's own entrance
// motion waits too (html[data-welcome] pauses it, index.css), so a cold open's blocks pop in as the
// welcome opens instead of behind it.

export type WelcomeState = 'showing' | 'leaving' | 'gone'

let state: WelcomeState = 'gone'
let done: (() => void) | null = null
let gone: Promise<void> | null = null
let hiddenAt: number | null = null
let raisedOnHide = false // the welcome now up went up as the app was hidden (a flicker takes it down)
const listeners = new Set<() => void>()

function set(next: WelcomeState) {
  state = next
  const root = document.documentElement
  if (next === 'showing') root.dataset.welcome = ''
  else delete root.dataset.welcome
  listeners.forEach(l => l())
}

export function showWelcome(): boolean {
  if (state !== 'gone') return false
  gone = new Promise(resolve => { done = resolve })
  set('showing')
  return true
}

// The tap: the screen underneath starts its entrance as the halves part.
export function leaveWelcome() {
  if (state === 'showing') set('leaving')
}

// The halves are off the screen: the app is all there is.
export function finishWelcome() {
  if (state === 'gone') return
  raisedOnHide = false
  set('gone')
  done?.()
  done = null
  gone = null
}

// Settles once the welcome has gone, or null when it is not up.
export function welcomeGone(): Promise<void> | null {
  return gone
}

export const welcomeState = () => state

export function useWelcome(): WelcomeState {
  return useSyncExternalStore(subscribe, welcomeState)
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

// Wall-clock time, not performance.now(): an iPhone that sleeps with the app in the background may stop
// the monotonic clock, and the time away is what matters here.
function onVisibility() {
  if (document.visibilityState === 'hidden') {
    hiddenAt = Date.now()
    if (welcomeOnHide(parseRoute(location.hash)) && showWelcome()) raisedOnHide = true
    return
  }
  if (hiddenAt === null) return
  const away = Date.now() - hiddenAt
  hiddenAt = null
  if (raisedOnHide && state === 'showing' && !welcomeOnReturn(away)) return finishWelcome()
  if (state === 'showing') resetToNow() // the welcome is staying up: it opens onto Now
}

// Every launch starts on it, before React's first paint.
export function installWelcome() {
  showWelcome()
  resetToNow() // a launch (a shared link included) opens onto Now too
  document.addEventListener('visibilitychange', onVisibility)
}
