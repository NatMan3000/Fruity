export type Route =
  | { name: 'now' }
  | { name: 'browse' }
  | { name: 'fruit'; id: string }
  | { name: 'year' }
  | { name: 'cook' }
  | { name: 'recipe'; id: string }
  | { name: 'cookmode'; id: string }
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
      if (!parts[1]) return { name: 'cook' }
      if (parts[2] === 'steps') return { name: 'cookmode', id: decodeURIComponent(parts[1]) }
      return { name: 'recipe', id: decodeURIComponent(parts[1]) }
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
    case 'recipe': return `#/cook/${encodeURIComponent(route.id)}`
    case 'cookmode': return `#/cook/${encodeURIComponent(route.id)}/steps`
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
    case 'cook':
    case 'recipe':
    case 'cookmode': return 'cook'
    case 'play':
    case 'quiz':
    case 'salad': return 'play'
  }
}
