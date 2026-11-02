// Per-fruit colour (DESIGN.md "Fruit colour"). Each fruit carries one vivid `colour`; the soft
// surfaces it tints are derived here at a FIXED lightness in OKLCH, so a dark fruit (mulberry) and
// a pale one (lemon) give rows of the same lightness and dark text keeps the same contrast on all.
// scripts/colour-contrast.test.ts checks every fruit's tints against the text and bar colours drawn on them.

type Rgb = [number, number, number]

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const fromLinear = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb
}

const rgbToHex = (rgb: Rgb) =>
  '#' + rgb.map(c => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()

function rgbToOklch([r, g, b]: Rgb): [number, number, number] {
  const [lr, lg, lb] = [r, g, b].map(toLinear)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [L, Math.hypot(A, B), Math.atan2(B, A)]
}

// Linear sRGB, unclamped, so the caller can tell when a colour is out of gamut.
function oklchToLinear(L: number, C: number, h: number): Rgb {
  const A = C * Math.cos(h)
  const B = C * Math.sin(h)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

// The fruit's hue at lightness L, chroma capped at maxC and pulled in until it fits sRGB.
function tone(hex: string, L: number, maxC: number): string {
  const [, c, h] = rgbToOklch(hexToRgb(hex))
  let C = Math.min(c, maxC)
  let lin = oklchToLinear(L, C, h)
  while (C > 0 && lin.some(v => v < 0 || v > 1)) {
    C -= 0.002
    lin = oklchToLinear(L, C, h)
  }
  return rgbToHex(lin.map(fromLinear) as Rgb)
}

export interface FruitTints {
  soft: string  // row and card surface
  wash: string  // icon circle, detail header band
}

export const TINT = { soft: { L: 0.955, C: 0.045 }, wash: { L: 0.9, C: 0.085 } } as const

const cache = new Map<string, FruitTints>()
export function fruitTints(colour: string): FruitTints {
  let t = cache.get(colour)
  if (!t) {
    t = { soft: tone(colour, TINT.soft.L, TINT.soft.C), wash: tone(colour, TINT.wash.L, TINT.wash.C) }
    cache.set(colour, t)
  }
  return t
}

// WCAG 2 contrast ratio between two hex colours.
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b2] = hexToRgb(hex).map(toLinear)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2
  }
  const [x, y] = [lum(a), lum(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
