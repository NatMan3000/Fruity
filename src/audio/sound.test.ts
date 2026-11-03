import { beforeEach, describe, expect, it, vi } from 'vitest'
import { installUnlock, resetSoundForTests, setSound, SOUND_KEY, sfx, soundOn, unlockAudio } from './sound'
import { isProgress as isQuizProgress, NEW_PROGRESS as NEW_QUIZ } from '../quiz/logic/progress'
import { isProgress as isCafeProgress, NEW_PROGRESS as NEW_CAFE } from '../cafe/logic/progress'

let oscillators = 0
class FakeContext {
  state = 'suspended'
  currentTime = 0
  sampleRate = 8000
  destination = {}
  resume = vi.fn(async () => { this.state = 'running' })
  createOscillator = () => { oscillators++; return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n: unknown) => n, start() {}, stop() {} } }
  createGain = () => ({ gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n: unknown) => n })
  createBuffer = () => ({ getChannelData: () => new Float32Array(8) })
  createBufferSource = () => ({ buffer: null, connect: (n: unknown) => n, start() {} })
  createBiquadFilter = () => ({ type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n: unknown) => n })
}

const store = new Map<string, string>()
beforeEach(() => {
  store.clear()
  oscillators = 0
  vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) })
  vi.stubGlobal('AudioContext', FakeContext)
  resetSoundForTests()
})

describe('app-wide sound setting', () => {
  it('is on by default, and off only once someone mutes it', () => {
    expect(soundOn()).toBe(true)
    setSound(false)
    expect(store.get(SOUND_KEY)).toBe('0')
    resetSoundForTests()
    expect(soundOn()).toBe(false)
  })

  it('ignores the old per-game "sound: false" (a default nobody chose): saves still load, sound stays on', () => {
    expect(isQuizProgress({ ...NEW_QUIZ, sound: false })).toBe(true)
    expect(isCafeProgress({ ...NEW_CAFE, sound: false })).toBe(true)
    expect(soundOn()).toBe(true)
  })
})

describe('sfx', () => {
  it('is a silent no-op before the first gesture unlocks audio (never queued)', () => {
    sfx.clunk()
    sfx.plop(2)
    expect(oscillators).toBe(0)
    unlockAudio()
    expect(oscillators).toBe(0) // nothing played later from the earlier calls
    sfx.plop(2)
    expect(oscillators).toBeGreaterThan(0)
  })

  it('is a no-op when muted, even after unlock', () => {
    unlockAudio()
    setSound(false)
    sfx.clunk()
    expect(oscillators).toBe(0)
  })

  it('unlocks once on the first gesture, then removes its listeners', () => {
    const handlers = new Map<string, () => void>()
    const target = { addEventListener: (e: string, h: () => void) => void handlers.set(e, h), removeEventListener: (e: string) => void handlers.delete(e) }
    installUnlock(target as unknown as Window)
    expect([...handlers.keys()].sort()).toEqual(['keydown', 'pointerdown', 'touchend'])
    handlers.get('touchend')!()
    expect(handlers.size).toBe(0)
    sfx.plop()
    expect(oscillators).toBeGreaterThan(0)
  })
})
