import { useSyncExternalStore } from 'react'
import { parseRoute, routeHash, type Route } from '../utils/route'

let navigatedInApp = false

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

const getHash = () => window.location.hash

export function navigate(route: Route) {
  const hash = routeHash(route)
  if (window.location.hash === hash) return
  navigatedInApp = true
  window.location.hash = hash
  // Instant scroll: smooth conflicts with re-render on mobile
  window.scrollTo(0, 0)
}

// Back one step if we arrived from inside the app, otherwise go to the list (deep link entry).
export function goBack() {
  if (navigatedInApp) window.history.back()
  else navigate({ name: 'browse' })
}

export function useRoute(): Route {
  return parseRoute(useSyncExternalStore(subscribe, getHash))
}
