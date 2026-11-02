// Scales an ingredient quantity ("1 1/2 tbsp", "200g (2 cups)", "4 x 250ml") for the serves stepper.
// Only numbers change: "pinch", "to taste" and "a few" stay as written. Spoons, cups and counts round to
// friendly fractions (1/4, 1/3, 1/2, 2/3, 3/4); grams and millilitres to amounts a scale shows; a size
// that is not an amount (the 250ml in "4 x 250ml", the 250g in "250g each", a 400g can) is left alone.

const NUMBER = /(\d+ \d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(\s?)(kg|g|ml|litres?|cm|cups?|tbsp|tsp|punnets?|bunch(?:es)?|balls?|slices?|cans?|pieces?)?\b/g

function parse(n: string): number {
  const mixed = n.match(/^(\d+) (\d+)\/(\d+)$/)
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3]
  const frac = n.match(/^(\d+)\/(\d+)$/)
  if (frac) return +frac[1] / +frac[2]
  return parseFloat(n)
}

const QUARTERS: [number, string][] = [[0, ''], [1 / 4, '1/4'], [1 / 2, '1/2'], [3 / 4, '3/4'], [1, '']]
const THIRDS: [number, string][] = [[1 / 3, '1/3'], [2 / 3, '2/3']]
const HALVES: [number, string][] = [[0, ''], [1 / 2, '1/2'], [1, '']]

// The nearest friendly fraction: quarters under 4 (cups also in thirds, a measuring cup has them), halves
// under 10, whole numbers above. Whole things (3 eggs, 1 orange) go in halves once there is at least one.
export function friendly(v: number, kind: 'spoon' | 'cup' | 'count' = 'spoon'): string {
  if (v >= 10) return String(Math.round(v))
  if (v >= 4) {
    const r = Math.round(v * 2) / 2
    return r % 1 ? `${Math.floor(r)} 1/2` : String(r)
  }
  const whole = Math.floor(v)
  const part = v - whole
  const steps = kind === 'count' && v >= 1 ? HALVES : kind === 'cup' ? [...QUARTERS, ...THIRDS] : QUARTERS
  let best = steps[0]
  for (const f of steps) if (Math.abs(f[0] - part) < Math.abs(best[0] - part)) best = f
  const w = whole + (best[0] === 1 ? 1 : 0)
  if (w === 0 && !best[1]) return '1/4' // never round an ingredient away
  return [w ? String(w) : '', best[1]].filter(Boolean).join(' ')
}

// Grams and millilitres a kitchen scale or jug shows: 5s under 50, 10s under 250, 25s above.
function metric(v: number): number {
  if (v < 10) return Math.max(1, Math.round(v))
  if (v < 50) return Math.round(v / 5) * 5
  if (v < 250) return Math.round(v / 10) * 10
  return Math.round(v / 25) * 25
}

const oneDecimal = (v: number) => String(Math.round(v * 10) / 10)

function plural(unit: string, many: boolean): string {
  const base = unit.startsWith('bunch') ? 'bunch' : unit.replace(/s$/, '')
  if (!many) return base
  return base === 'bunch' ? 'bunches' : `${base}s`
}

function amount(v: number, unit: string, gap: string): string {
  switch (unit) {
    case 'g':
    case 'ml': {
      const big = unit === 'g' ? 'kg' : 'litre'
      if (v >= 1000) return unit === 'g' ? `${oneDecimal(v / 1000)}kg` : `${oneDecimal(v / 1000)} ${plural(big, v > 1000)}`
      return `${metric(v)}${gap}${unit}`
    }
    case 'kg':
      return v < 1 ? `${metric(v * 1000)}g` : `${oneDecimal(v)}${gap}kg`
    case 'litre':
    case 'litres':
      return v < 1 ? `${metric(v * 1000)}ml` : `${oneDecimal(v)}${gap}${plural('litre', v > 1)}`
    case 'cm':
      return `${Math.max(1, Math.round(v))}${gap}cm`
    case '':
      return `${friendly(v, 'count')}${gap}`
    case 'tbsp':
    case 'tsp':
      return `${friendly(v)}${gap}${unit}`
    default: {
      const text = friendly(v, /^cups?$/.test(unit) ? 'cup' : 'count')
      return `${text}${gap}${plural(unit, v > 1)}`
    }
  }
}

export function scaleQty(qty: string, factor: number): string {
  if (factor === 1 || !Number.isFinite(factor) || factor <= 0) return qty

  // "400g can": the can stays 400g, the number of cans changes.
  const can = qty.match(/^(\d+(?:g|ml)) (can|tin)\b(.*)$/)
  if (can) {
    const n = friendly(factor, 'count')
    return n === '1' ? qty : `${n} x ${can[1]} ${can[2]}s${can[3]}`
  }

  return qty.replace(NUMBER, (match, num: string, gap: string, unit: string | undefined, offset: number) => {
    const before = qty.slice(0, offset)
    const after = qty.slice(offset + match.length)
    if (/x\s*$/.test(before)) return match          // the jar size in "4 x 250ml"
    if (/^\s*each\b/.test(after)) return match       // "about 250g each"
    return amount(parse(num) * factor, unit ?? '', gap)
  })
}
