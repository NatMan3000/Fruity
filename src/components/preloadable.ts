import { createElement, lazy, useState, type ComponentType } from 'react'

// React.lazy with a `preload()` that fetches the chunk ahead (useRoute's setRoutePreload). Once the chunk
// is in, a new instance renders it straight away instead of suspending for a frame, which would flash its
// Suspense fallback mid page move. Each instance keeps the type it mounted with, so nothing remounts.
export function preloadable<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  let ready: ComponentType<P> | null = null
  let loading: Promise<ComponentType<P>> | null = null
  const preload = () => (loading ??= load().then(
    m => (ready = m.default),
    err => { loading = null; throw err }, // let the next try fetch again
  ))
  const Lazy = lazy(() => preload().then(c => ({ default: c })))
  function Preloadable(props: P) {
    const [C] = useState<ComponentType<P>>(() => ready ?? Lazy)
    return createElement(C, props)
  }
  return Object.assign(Preloadable, { preload })
}
