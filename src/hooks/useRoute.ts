import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { navMotion, type NavMotion } from '../utils/navMotion'
import { parseRoute, routeHash, type Route } from '../utils/route'

// Hash router. Every screen is a real history entry (#/fruit/mango), so deep links, Back and the
// iPhone's edge swipe all work. Moves the app makes (a tap, the Back button) slide with the View
// Transitions API (DESIGN.md "Motion", page moves; the slides are in index.css). Moves the browser makes
// (the edge swipe, a Back key) render at once with no motion of ours: Safari animates its own swipe, and
// it sets no `hasUAVisualTransition` before iOS 18, so the safe rule is never to animate a pop we did not
// start.
//
// Scroll restoration stays 'auto' and the screen we go back to renders inside the popstate event, before
// the browser restores the scroll. With 'manual', iOS throws away its picture of the previous screen when
// the scroll position differs from when it was taken (WebKit ViewGestureControllerIOS.mm, canUseSnapshot)
// and shows a flat colour during and after the swipe instead: the frozen "skeleton" (Nathan, 3 Nov 2026).

let navigatedInApp = false
let ticket = 0
let pendingBack: (() => void) | null = null
let running: { finished: Promise<void>; skipTransition: () => void } | null = null
let preload: ((route: Route) => Promise<unknown> | undefined) | null = null
const listeners = new Set<() => void>()
const scrollMemory = new Map<string, number>()

const keyOf = (hash: string) => routeHash(parseRoute(hash))
const notify = () => listeners.forEach(l => l())
const render = () => flushSync(notify)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => scrollMemory.set(keyOf(location.hash), window.scrollY), { passive: true })
  window.addEventListener('popstate', onPopState)
  window.addEventListener('hashchange', render) // a hash typed into the address bar
}

function onPopState() {
  // Our own Back: the transition waiting on it renders the screen (goBack below).
  if (pendingBack) return pendingBack()
  // Anyone else's (the swipe, a Back key): no motion, and no transition of ours left running on top.
  running?.skipTransition()
  render()
  restoreScroll()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

const getHash = () => window.location.hash

type TransitionDoc = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => { finished: Promise<void>; skipTransition: () => void }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Screens in chunks of their own (a recipe, the games) register a loader, so a move into one fetches it
// first and never slides in its loading screen (App.tsx).
export function setRoutePreload(fn: (route: Route) => Promise<unknown> | undefined) {
  preload = fn
}

// Run `update` (which renders the new screen) as a page move.
function move(motion: NavMotion, update: () => void) {
  if (motion === 'none' || reducedMotion()) return update()
  const start = (document as TransitionDoc).startViewTransition?.bind(document)
  if (!start) {
    update()
    return slideIn(motion)
  }
  transition(start, motion, update)
}

// One page move at a time; html[data-nav] tells the CSS which slide to play.
function transition(start: NonNullable<TransitionDoc['startViewTransition']>, motion: NavMotion, update: () => Promise<void> | void) {
  running?.skipTransition()
  const root = document.documentElement
  root.dataset.nav = motion
  const t = start(update)
  running = t
  t.finished.catch(() => {}).finally(() => {
    if (running !== t) return
    running = null
    delete root.dataset.nav
  })
}

// Without View Transitions: the new screen alone slides and fades in.
function slideIn(motion: NavMotion) {
  const sign = motion === 'push' || motion === 'next' ? 1 : -1
  const far = motion === 'push' || motion === 'pop' ? 48 : 24
  document.querySelector('main')?.animate(
    [{ opacity: 0, transform: `translateX(${sign * far}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 240, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
  )
}

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function navigate(route: Route) {
  const hash = routeHash(route)
  if (keyOf(location.hash) === hash) return
  navigatedInApp = true
  const mine = ++ticket
  const go = () => {
    if (mine !== ticket) return // a later tap won
    move(navMotion(parseRoute(location.hash), route, 'forward'), () => {
      history.pushState(null, '', hash)
      render()
      window.scrollTo(0, 0) // instant: smooth fights the re-render on a phone
    })
  }
  const ready = preload?.(route)
  if (!ready) return go()
  // Past a short wait it moves anyway, and the screen's own loading state shows.
  void Promise.race([ready, pause(400)]).catch(() => {}).then(go)
}

// Back one step if we arrived from inside the app, otherwise go to `fallback` (deep link entry).
export function goBack(fallback: Route = { name: 'now' }) {
  if (!navigatedInApp) return navigate(fallback)
  ticket++
  const start = (document as TransitionDoc).startViewTransition?.bind(document)
  const animate = !reducedMotion()
  // The screen renders when the popstate arrives; the timer means a lost one never leaves it hanging.
  const back = (then?: () => void) => new Promise<void>(resolve => {
    const done = () => {
      clearTimeout(timer)
      pendingBack = null
      render()
      restoreScroll()
      then?.()
      resolve()
    }
    const timer = setTimeout(done, 500)
    pendingBack = done
    history.back()
  })
  if (!animate) return void back()
  if (!start) return void back(() => slideIn('pop'))
  transition(start, 'pop', () => back())
}

function restoreScroll() {
  window.scrollTo(0, scrollMemory.get(keyOf(location.hash)) ?? 0)
}

export function useRoute(): Route {
  return parseRoute(useSyncExternalStore(subscribe, getHash))
}
