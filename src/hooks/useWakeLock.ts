import { useEffect } from 'react'

// Keeps the screen on while `active` (cook mode), with the Screen Wake Lock API where the browser has it
// (Safari 16.4+, Chrome). The browser drops the lock whenever the page is hidden, so it is asked for
// again when the page comes back, and released on the way out.
type WakeLockSentinelLike = { release: () => Promise<void>; released: boolean }
type WakeNavigator = Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> } }

export const canWakeLock = typeof navigator !== 'undefined' && 'wakeLock' in navigator

export function useWakeLock(active: boolean) {
  useEffect(() => {
    const wake = (navigator as WakeNavigator).wakeLock
    if (!active || !wake) return
    let lock: WakeLockSentinelLike | null = null
    let live = true
    const ask = async () => {
      if (document.visibilityState !== 'visible' || (lock && !lock.released)) return
      try {
        const l = await wake.request('screen')
        if (live) lock = l
        else void l.release()
      } catch (err) {
        console.warn('fruity: the screen may sleep (no wake lock)', err) // low battery mode, or not allowed
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void ask()
      else if (lock && !lock.released) void lock.release().catch(() => {})
    }
    void ask()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      live = false
      document.removeEventListener('visibilitychange', onVisibility)
      if (lock && !lock.released) void lock.release().catch(() => {})
    }
  }, [active])
}
