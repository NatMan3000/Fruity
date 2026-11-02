export type Route =
  | { name: 'now' }
  | { name: 'browse' }
  | { name: 'fruit'; id: string }
  | { name: 'year' }
  | { name: 'cook' }
  | { name: 'play' }
  | { name: 'quiz' }
  | { name: 'salad' }

export type Tab = 'now' | 'fruit' | 'cook' | 'play'

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '')
  const parts = path.split('/').filter(Boolean)
  switch (parts[0]) {
    case 'fruit':
      if (!parts[1]) return { name: 'browse' }
      if (parts[1] === 'year') return { name: 'year' }
      return { name: 'fruit', id: decodeURIComponent(parts[1]) }
    case 'cook':
      return { name: 'cook' }
    case 'play':
      if (parts[1] === 'quiz') return { name: 'quiz' }
      if (parts[1] === 'salad') return { name: 'salad' }
      return { name: 'play' }
    // Phase 0 links, kept so old bookmarks and shared links still land
    case 'calendar':
      return { name: 'year' }
    case 'quiz':
      return { name: 'quiz' }
    case 'salad':
      return { name: 'salad' }
    default:
      return { name: 'now' }
  }
}

export function routeHash(route: Route): string {
  switch (route.name) {
    case 'now': return '#/'
    case 'browse': return '#/fruit'
    case 'fruit': return `#/fruit/${encodeURIComponent(route.id)}`
    case 'year': return '#/fruit/year'
    case 'cook': return '#/cook'
    case 'play': return '#/play'
    case 'quiz': return '#/play/quiz'
    case 'salad': return '#/play/salad'
  }
}

export function tabFor(route: Route): Tab {
  switch (route.name) {
    case 'now': return 'now'
    case 'browse':
    case 'fruit':
    case 'year': return 'fruit'
    case 'cook': return 'cook'
    case 'play':
    case 'quiz':
    case 'salad': return 'play'
  }
}
