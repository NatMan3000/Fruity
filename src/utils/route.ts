export type Route =
  | { name: 'browse' }
  | { name: 'fruit'; id: string }
  | { name: 'calendar' }
  | { name: 'salad' }
  | { name: 'quiz' }

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '')
  const parts = path.split('/').filter(Boolean)
  switch (parts[0]) {
    case 'fruit':
      return parts[1] ? { name: 'fruit', id: decodeURIComponent(parts[1]) } : { name: 'browse' }
    case 'calendar':
    case 'salad':
    case 'quiz':
      return { name: parts[0] }
    default:
      return { name: 'browse' }
  }
}

export function routeHash(route: Route): string {
  switch (route.name) {
    case 'browse': return '#/'
    case 'fruit': return `#/fruit/${encodeURIComponent(route.id)}`
    default: return `#/${route.name}`
  }
}
