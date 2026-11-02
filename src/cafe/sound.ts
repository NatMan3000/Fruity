// Little game sounds made on the fly with the Web Audio API: no audio files to download.
// Silent until the speaker is switched on (a tap, which also lets iOS start audio).

type Ctx = AudioContext
let ctx: Ctx | null = null
let enabled = false

function audio(): Ctx | null {
  if (!enabled) return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setSound(on: boolean) {
  enabled = on
  if (on) audio() // create and resume inside the tap that switched it on
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
