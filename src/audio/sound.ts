// Little sounds made on the fly with the Web Audio API: no audio files to download.
// One app-wide setting (localStorage 'fruity.sound', ON unless someone mutes it; the quiz's and cafe's speaker
// buttons and Now's dish all share it). iOS only starts audio inside a user gesture, so the first tap, touch or
// key anywhere unlocks it (`installUnlock`); a sound asked for before that is skipped, never queued.
import { useSyncExternalStore } from 'react'

type Ctx = AudioContext
export const SOUND_KEY = 'fruity.sound'
let ctx: Ctx | null = null
let unlocked = false
const listeners = new Set<() => void>()

function readSetting(): boolean {
  try { return globalThis.localStorage?.getItem(SOUND_KEY) !== '0' } catch { return true }
}
let enabled = readSetting()

function audio(): Ctx | null {
  if (!enabled || !unlocked) return null
  if (ctx!.state === 'suspended') void ctx!.resume()
  return ctx
}

// Safari 16.4+: 'ambient' mixes with the person's own music (never stops it) and follows the silent switch.
function mixWithOthers() {
  try {
    const s = (navigator as unknown as { audioSession?: { type: string } }).audioSession
    if (s) s.type = 'ambient'
  } catch { /* an older Safari: the default is fine */ }
}

// Create and resume the context. Only ever called from a user gesture.
export function unlockAudio() {
  if (unlocked) return
  const w = globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
  const AC = w.AudioContext ?? w.webkitAudioContext
  if (!AC) return
  mixWithOthers()
  ctx = new AC()
  unlocked = true
  void ctx.resume()
}

// The first gesture anywhere unlocks audio, then the listeners go.
export function installUnlock(target: Pick<Window, 'addEventListener' | 'removeEventListener'> = window) {
  const events = ['pointerdown', 'touchend', 'keydown'] as const
  const go = () => {
    unlockAudio()
    events.forEach(e => target.removeEventListener(e, go, true))
  }
  events.forEach(e => target.addEventListener(e, go, true))
}

export const soundOn = () => enabled

// The speaker buttons call this from their tap (so it also unlocks audio).
export function setSound(on: boolean) {
  enabled = on
  try { globalThis.localStorage?.setItem(SOUND_KEY, on ? '1' : '0') } catch { /* private mode: lasts this visit */ }
  if (on) unlockAudio()
  listeners.forEach(l => l())
}

export function useSound(): [boolean, () => void] {
  const on = useSyncExternalStore(l => { listeners.add(l); return () => { listeners.delete(l) } }, soundOn)
  return [on, () => setSound(!enabled)]
}

// For tests: forget everything and read the setting afresh.
export function resetSoundForTests() {
  ctx = null
  unlocked = false
  enabled = readSetting()
}

function tone(freq: number, dur: number, { type = 'sine' as OscillatorType, gain = 0.18, slide = 0, delay = 0 } = {}) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + delay
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function noise(dur: number, { gain = 0.2, from = 2400, to = 600, delay = 0 } = {}) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + delay
  const len = Math.ceil(a.sampleRate * dur)
  const buf = a.createBuffer(1, len, a.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(from, t)
  f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = a.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(a.destination)
  src.start(t)
}

export const sfx = {
  // The Now dish (HeroDish): a soft ceramic clunk as the bowl lands (harder landing, deeper and louder),
  // and a light plop as each fruit drops in (`i` varies the pitch so staggered landings sound playful).
  clunk: (impact = 1) => {
    tone(180 + 40 * impact, 0.16, { type: 'sine', gain: 0.1 + 0.08 * impact, slide: -70 })
    tone(1320, 0.22, { type: 'sine', gain: 0.035 * impact, delay: 0.005 }) // the glaze's ring
    noise(0.05, { gain: 0.08 * impact, from: 3000, to: 1200 })
  },
  plop: (i = 0) => {
    const f = 300 + (i % 5) * 55
    tone(f, 0.1, { type: 'sine', gain: 0.1, slide: 160 })
    noise(0.04, { gain: 0.03, from: 2200, to: 900 })
  },
  pop: () => tone(520 + Math.random() * 180, 0.12, { type: 'triangle', slide: 300 }),
  thud: () => tone(150, 0.12, { type: 'sine', gain: 0.22, slide: -60 }),
  chop: () => {
    noise(0.08, { gain: 0.35, from: 5000, to: 1500 })
    tone(900, 0.06, { type: 'square', gain: 0.05, delay: 0.01 })
    noise(0.22, { gain: 0.12, from: 900, to: 300, delay: 0.05 }) // the juicy splash
  },
  swish: () => noise(0.25, { gain: 0.08, from: 600, to: 1800 }),
  nope: () => {
    tone(330, 0.14, { type: 'triangle' })
    tone(262, 0.2, { type: 'triangle', delay: 0.13 })
  },
  bell: () => {
    tone(1318, 0.5, { gain: 0.12 })
    tone(1976, 0.35, { gain: 0.05, delay: 0.01 })
  },
  star: (i: number) => tone([784, 988, 1175][i] ?? 1175, 0.28, { type: 'triangle', gain: 0.14 }),
  yay: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, { type: 'triangle', gain: 0.12, delay: i * 0.08 })),
  boop: () => tone(440, 0.1, { type: 'sine', slide: 220 }),
}

// Reads the order out loud for kids still learning to read. A tap starts it, so iOS allows it.
export function speak(text: string) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-AU'
  u.rate = 0.95
  u.pitch = 1.15
  const voice = window.speechSynthesis.getVoices().find(v => v.lang === 'en-AU')
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
  return true
}
