import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { navigate } from '../hooks/useRoute'
import { routeHash, type Route } from '../utils/route'

interface LinkProps {
  to: Route
  children: ReactNode
  className?: string
  style?: CSSProperties
  morph?: boolean // morph the [data-morph] icon inside into the detail hero
  ariaLabel?: string
  ariaCurrent?: 'page'
  onNavigate?: () => void
}

// A real link (long-press and new tab still work) that routes in-app.
export function Link({ to, children, className, style, morph = false, ariaLabel, ariaCurrent, onNavigate }: LinkProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onNavigate?.()
    navigate(to, { morphFrom: morph ? e.currentTarget.querySelector('[data-morph]') : null })
  }
  return (
    <a href={routeHash(to)} onClick={onClick} className={className} style={style} aria-label={ariaLabel} aria-current={ariaCurrent}>
      {children}
    </a>
  )
}
