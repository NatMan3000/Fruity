// A pick tip short enough for one line on a Now row: the first sentence's leading clauses,
// up to about 40 characters. A first clause too short to help ("Firm") takes the next one too.
// The full tip is on the fruit page the row opens.
const MAX = 40
const MIN = 16

export function glanceTip(pick: string | undefined): string | undefined {
  if (!pick) return undefined
  const first = pick.split(/(?<=\.)\s/)[0].replace(/\.$/, '')
  const clauses = first.split(/(?<=[,;])\s/)
  let tip = clauses[0]
  for (const c of clauses.slice(1)) {
    if (tip.length >= MIN && (tip + ' ' + c).length > MAX) break
    tip += ' ' + c
  }
  return tip.replace(/[,;]$/, '')
}
