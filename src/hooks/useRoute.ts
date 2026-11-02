import { useLayoutEffect, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { parseRoute, routeHash, type Route } from '../utils/route'

// Hash router. The iPhone back swipe and deep links work because every screen is a real
// history entry (#/fruit/mango). In-app moves can morph the tapped fruit into the detail
// hero with the View Transitions API (DESIGN.md "Motion").

let navigatedInApp = false
let lastMoveWasPop = false
const listeners = new Set<() => void>()
const scrollMemory = new Map<string, number>()

const keyOf = (hash: string) => routeHash(parseRoute(hash))
const notify = () => listeners.forEach(l => l())

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.addEventListener('scroll', () => scrollMemory.set(keyOf(location.hash), window.scrollY), { passive: true })
  window.addEventListener('popstate', () => { lastMoveWasPop = true })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('hashchange', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('hashchange', cb)
  }
}

const getHash = () => window.location.hash

type TransitionDoc = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => { finished: Promise<void> }
}

export function canMorph(): boolean {
  return typeof (document as TransitionDoc).startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const MORPH = 'fruit-hero'

function setMorph(el: Element | null | undefined, on: boolean) {
  if (el instanceof HTMLElement) el.style.viewTransitionName = on ? MORPH : ''
}

interface NavigateOptions {
  morphFrom?: Element | null // the tapped icon or image; it morphs into the detail hero
}

export function navigate(route: Route, { morphFrom }: NavigateOptions = {}) {
  const hash = routeHash(route)
  if (keyOf(window.location.hash) === hash) return
  navigatedInApp = true
  lastMoveWasPop = false
  const update = () => {
    window.location.hash = hash
    flushSync(notify)
    // Instant scroll: smooth conflicts with re-render on mobile
    window.scrollTo(0, 0)
  }
  if (!morphFrom || !canMorph()) return update()
  setMorph(morphFrom, true)
  const t = (document as TransitionDoc).startViewTransition!(() => {
    setMorph(morphFrom, false)
    update()
  })
  t.finished.finally(() => setMorph(morphFrom, false))
}

// Back one step if we arrived from inside the app, otherwise go to `fallback` (deep link entry).
// From a fruit page the hero morphs back into that fruit's icon on the screen we return to.
export function goBack(fallback: Route = { name: 'now' }) {
  if (!navigatedInApp) return navigate(fallback)
  const from = parseRoute(location.hash)
  if (from.name !== 'fruit' || !canMorph()) return history.back()

  let target: Element | null = null
  const back = () => new Promise<void>(resolve => {
    const done = () => {
      window.removeEventListener('popstate', done)
      clearTimeout(timer)
      flushSync(notify)
      restoreScroll()
      target = document.querySelector(`[data-morph="${CSS.escape(from.id)}"]`)
      setMorph(target, true)
      resolve()
    }
    const timer = setTimeout(done, 600) // never leave the transition hanging
    window.addEventListener('popstate', done)
    history.back()
  })
  const t = (document as TransitionDoc).startViewTransition!(back)
  t.finished.finally(() => setMorph(target, false))
}

function restoreScroll() {
  window.scrollTo(0, scrollMemory.get(keyOf(location.hash)) ?? 0)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash)
  // Back and forward (including the iPhone swipe) return to where you were on that screen.
  useLayoutEffect(() => {
    if (lastMoveWasPop) {
      lastMoveWasPop = false
      restoreScroll()
    }
  }, [hash])
  return parseRoute(hash)
}
