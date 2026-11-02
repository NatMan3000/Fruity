// Contact sheets of every 3D fruit, whole and cut open, from the fruit page's camera: the check for
// "does each one read as its fruit at a glance". Starts the Vite dev server and a private headless
// Chrome, renders through models.html (src/dev/model-sheet.ts), and writes two labelled PNGs plus a
// full-size image of every fruit whole and cut (outDir/whole/<id>.png, outDir/cut/<id>.png) to look at
// closely.
// Then the Now dish for every month with every fruit cut by the Slice button (models-dish.png and
// outDir/dish/<Mon>.png, whole at rest in <Mon>-whole.png), at three turns of the dish; whole fruit at
// rest must sit inside the bowl too; then a dish of five of every fruit, whole and cut
// (models-dish-of-five.png).
// It FAILS (exit 1, red labels) if any dish piece meets another fruit, the rim or the bowl, or if any cut piece passes through another piece or through what is
// left of the fruit (oriented-box overlap after layout, 0.01 tolerance): DESIGN.md's cut rule; or if a
// leaf that lies on the skin (a strawberry's sepals) has any vertex inside the body.
// Run: bun run models:sheet [outDir]   (default /tmp; macOS Chrome path)
import sharp from 'sharp'
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT = process.argv[2] ?? '/tmp'
const PORT = 4186
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const vite = spawn('bunx', ['vite', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const profile = mkdtempSync(join(tmpdir(), 'fruity-models-chrome-'))
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-first-run', 'about:blank'], { stdio: 'ignore' })
const stop = () => { vite.kill(); chrome.kill() }

try {
  let port = ''
  for (let i = 0; i < 100 && !port; i++) {
    await sleep(100)
    const f = join(profile, 'DevToolsActivePort')
    if (existsSync(f)) port = readFileSync(f, 'utf8').split('\n')[0]
  }
  if (!port) throw new Error('Chrome did not start')
  const ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json() as { webSocketDebuggerUrl: string }
  const ws = new WebSocket(ver.webSocketDebuggerUrl)
  await new Promise(r => ws.addEventListener('open', r, { once: true }))
  let n = 0
  const waiting = new Map<number, (v: { result?: unknown; error?: { message: string } }) => void>()
  ws.addEventListener('message', e => { const m = JSON.parse(String(e.data)); waiting.get(m.id)?.(m); waiting.delete(m.id) })
  const send = async (method: string, params: object = {}, sessionId?: string) => {
    const id = ++n
    ws.send(JSON.stringify({ id, method, params, sessionId }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CDP results are untyped JSON
    const m = await new Promise<{ result?: any; error?: { message: string } }>(r => waiting.set(id, r))
    if (m.error) throw new Error(`${method}: ${m.error.message}`)
    return m.result
  }
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const evalJs = async (expression: string) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId)).result?.value
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/Fruity/models.html`)).ok) break } catch { /* not up yet */ }
    await sleep(250)
  }
  await send('Page.navigate', { url: `http://localhost:${PORT}/Fruity/models.html` }, sessionId)
  for (let i = 0; i < 120 && (await evalJs('document.title')) !== 'ready'; i++) await sleep(250)
  const ids: string[] = await evalJs('window.fruitIds')
  const failures: string[] = []
  mkdirSync(join(OUT, 'cut'), { recursive: true })
  mkdirSync(join(OUT, 'whole'), { recursive: true })
  for (const cut of [false, true]) {
    const tiles: { input: Buffer; left: number; top: number }[] = []
    const COLS = 8, W = 280, H = 215, LABEL = 30
    for (const [i, id] of ids.entries()) {
      const { url, overlaps } = await evalJs(`window.renderFruit(${JSON.stringify(id)}, ${cut})`) as { url: string; overlaps: string[] }
      const png = Buffer.from(url.split(',')[1], 'base64')
      writeFileSync(join(OUT, cut ? 'cut' : 'whole', `${id}.png`), png)
      if (overlaps.length) failures.push(`${id}: ${overlaps.join(', ')}`)
      const x = (i % COLS) * W, y = Math.floor(i / COLS) * (H + LABEL)
      tiles.push({ input: await sharp(png).resize(W, H).toBuffer(), left: x, top: y })
      const bad = overlaps.length > 0
      const svg = `<svg width="${W}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bad ? '#C00' : '#222'}"/><text x="10" y="21" font-family="Helvetica" font-size="17" fill="#fff">${id}${bad ? ' OVERLAP' : ''}</text></svg>`
      tiles.push({ input: Buffer.from(svg), left: x, top: y + H })
    }
    const rows = Math.ceil(ids.length / COLS)
    const out = join(OUT, `models-${cut ? 'cut' : 'whole'}.png`)
    await sharp({ create: { width: COLS * W, height: rows * (H + LABEL), channels: 3, background: '#222' } }).composite(tiles).png().toFile(out)
    console.log(`wrote ${out} (${ids.length} fruit)`)
  }
  // The Now dish, every month, every fruit cut open by the Slice button, at three turns of the dish:
  // no pieces meeting (within a fruit or between fruit), nothing on the rim, nothing in the bowl.
  {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const tiles: { input: Buffer; left: number; top: number }[] = []
    const COLS = 4, W = 390, H = 300, LABEL = 30
    mkdirSync(join(OUT, 'dish'), { recursive: true })
    let slowest = 0
    for (const [m, month] of MONTHS.entries()) {
      for (const spin of [-0.3, 1.1, 2.6]) {
        const { url, problems, names, ms } = await evalJs(`window.renderDish(${JSON.stringify(month)}, ${spin})`) as { url: string; problems: string[]; names: string[]; ms: number }
        slowest = Math.max(slowest, ms)
        if (problems.length) failures.push(`dish ${month} (turned ${spin}, ${names.join(' ')}): ${problems.join('; ')}`)
        if (spin !== -0.3) continue
        const png = Buffer.from(url.split(',')[1], 'base64')
        writeFileSync(join(OUT, 'dish', `${month}.png`), png)
        const whole = await evalJs(`window.renderDish(${JSON.stringify(month)}, ${spin}, false)`) as { url: string }
        writeFileSync(join(OUT, 'dish', `${month}-whole.png`), Buffer.from(whole.url.split(',')[1], 'base64'))
        const x = (m % COLS) * W, y = Math.floor(m / COLS) * (H + LABEL)
        tiles.push({ input: await sharp(png).resize(W, H).toBuffer(), left: x, top: y })
        const bad = problems.length > 0
        const svg = `<svg width="${W}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bad ? '#C00' : '#222'}"/><text x="10" y="21" font-family="Helvetica" font-size="15" fill="#fff">${month}: ${names.join(', ')}${bad ? ' PROBLEM' : ''}</text></svg>`
        tiles.push({ input: Buffer.from(svg), left: x, top: y + H })
      }
    }
    // Every fruit, five of it in one dish, whole at rest (and cut, if it cuts): the hop-type fruit
    // (rhubarb, grapes, cherries, berries, bananas) never come up together in a month's dish, so this
    // puts each one in every slot.
    const ofOne: { input: Buffer; left: number; top: number }[] = []
    for (const [k, id] of ids.entries()) {
      for (const cut of [false, true]) {
        const { url, problems } = await evalJs(`window.renderDishOf(${JSON.stringify(Array(5).fill(id))}, -0.3, ${cut})`) as { url: string; problems: string[] }
        if (problems.length) failures.push(`dish of five ${id} (${cut ? 'cut' : 'whole'}): ${problems.join('; ')}`)
        if (!cut) ofOne.push({ input: await sharp(Buffer.from(url.split(',')[1], 'base64')).resize(195, 150).toBuffer(), left: (k % 8) * 195, top: Math.floor(k / 8) * 150 })
      }
    }
    await sharp({ create: { width: 8 * 195, height: Math.ceil(ids.length / 8) * 150, channels: 3, background: '#222' } }).composite(ofOne).png().toFile(join(OUT, 'models-dish-of-five.png'))
    const out = join(OUT, 'models-dish.png')
    await sharp({ create: { width: COLS * W, height: 3 * (H + LABEL), channels: 3, background: '#222' } }).composite(tiles).png().toFile(out)
    console.log(`wrote ${out} (12 dishes, all cut; slowest plan ${slowest} ms)`)
  }
  ws.close()
  if (failures.length) {
    console.error(`FAIL: ${failures.length} problems:\n  ${failures.join('\n  ')}`)
    process.exitCode = 1
  } else console.log('ok: no cut pieces overlap')
} finally {
  stop()
}
