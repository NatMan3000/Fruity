import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The welcome's whole life with a fake document: a launch, a tap, trips to the background.
let visibility: () => void
const doc = {
  visibilityState: 'visible' as DocumentVisibilityState,
  documentElement: { dataset: {} as Record<string, string> },
  addEventListener: (type: string, h: () => void) => { if (type === 'visibilitychange') visibility = h },
}
const away = (ms: number, hash = '#/') => {
  location.hash = hash
  doc.visibilityState = 'hidden'
  visibility()
  vi.advanceTimersByTime(ms)
  doc.visibilityState = 'visible'
  visibility()
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.resetModules()
  doc.visibilityState = 'visible'
  doc.documentElement.dataset = {}
  vi.stubGlobal('document', doc)
  vi.stubGlobal('location', { hash: '#/' })
  vi.stubGlobal('history', { replaceState: (_s: unknown, _t: string, hash: string) => { location.hash = hash } })
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const load = async () => {
  const w = await import('./useWelcome')
  w.installWelcome()
  return w
}
const tap = (w: Awaited<ReturnType<typeof load>>) => { w.leaveWelcome(); w.finishWelcome() }

describe('the welcome screen', () => {
  it('is up on every launch, deep links included, opens onto Now, and the 3D heroes wait for it to go', async () => {
    location.hash = '#/fruit/apple'
    const w = await load()
    expect(w.welcomeState()).toBe('showing')
    expect(location.hash).toBe('#/') // always Now underneath (Nathan, 3 Nov 2026)
    expect('welcome' in doc.documentElement.dataset).toBe(true) // the screen's entrance waits
    const gone = w.welcomeGone()
    expect(gone).not.toBeNull()
    let heard = false
    void gone!.then(() => { heard = true })
    w.leaveWelcome()
    expect('welcome' in doc.documentElement.dataset).toBe(false) // the tap starts it
    await Promise.resolve()
    expect(heard).toBe(false) // still leaving: the bowl has not started
    w.finishWelcome()
    await Promise.resolve()
    expect(heard).toBe(true)
    expect(w.welcomeGone()).toBeNull()
  })

  it('comes back after a real time away, and opens onto Now', async () => {
    const w = await load()
    tap(w)
    away(60_000, '#/fruit/mango')
    expect(w.welcomeState()).toBe('showing')
    expect(location.hash).toBe('#/')
  })

  it('stays away after a flicker of hidden (under 2 s)', async () => {
    const w = await load()
    tap(w)
    away(800, '#/fruit/mango')
    expect(w.welcomeState()).toBe('gone')
    expect(location.hash).toBe('#/fruit/mango') // a flicker leaves you where you were
    expect(w.welcomeGone()).toBeNull()
  })

  it('never goes over Cook mode', async () => {
    const w = await load()
    tap(w)
    away(10 * 60_000, '#/cook/peach-crumble/steps')
    expect(w.welcomeState()).toBe('gone')
  })

  it('a flicker does not take down the launch welcome nobody has tapped yet', async () => {
    const w = await load()
    away(500)
    expect(w.welcomeState()).toBe('showing')
  })
})
