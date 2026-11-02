// Dev-only check page for the 3D fruit (models.html, driven by scripts/model-sheet.ts): renders one
// fruit at a time, whole or cut open, from the fruit page's camera and light, and hands back a PNG.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { FRUITS } from '../assets/fruits'
import { cutParts, buildFruit } from '../three/models'
import { cutOverlaps, planCut, stepCut } from '../three/cutting'
import { seasonOf } from '../utils/seasonality'
import { seasonTones, tonesOf } from '../utils/tones'
import { dishFruits } from '../utils/dishFruits'
import { dishGeometry, dishProblems, planDish, restPoses, RIM } from '../three/dish'
import type { Month } from '../types/fruit'

const canvas = document.getElementById('c') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 1.05

const scene = new THREE.Scene()
const pm = new THREE.PMREMGenerator(renderer)
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.55
scene.add(new THREE.HemisphereLight('#FFF4E0', '#6A3A5A', 1.1))
const key = new THREE.DirectionalLight('#ffffff', 2.4)
key.position.set(1.4, 6, 2.2) // the fruit page's key light (SpinFruit)
key.castShadow = true
key.shadow.mapSize.set(1024, 1024)
key.shadow.bias = -0.0004
key.shadow.normalBias = 0.02
Object.assign(key.shadow.camera, { left: -2.8, right: 2.8, top: 2.8, bottom: -2.8, near: 1, far: 12 })
scene.add(key)
const fill = new THREE.DirectionalLight('#FFE8F0', 1.4)
fill.position.set(-3, 2.5, -3)
scene.add(fill)
const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.45, transparent: true }))
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.012
floor.receiveShadow = true
scene.add(floor)

// The fruit page's camera (src/three/SpinFruit.tsx).
const camera = new THREE.PerspectiveCamera(30, 780 / 600, 0.1, 50) // the fruit page hero's shape
camera.position.set(0, 1.9, 4.6)
camera.lookAt(0, 0.86, 0)
camera.updateMatrixWorld()

const SIZE = 1.9

declare global {
  interface Window { renderDish: (month: Month, spin: number, cut?: boolean) => { url: string; problems: string[]; names: string[]; ms: number }; renderDishOf: (ids: string[], spin: number, cut?: boolean) => { url: string; problems: string[]; names: string[]; ms: number }; renderFruit: (id: string, cut: boolean, turn?: number, after?: number) => { url: string; overlaps: string[] }; fruitIds: string[] }
}

// Leaves that lie on the skin (a strawberry's sepals and stem, tagged `hug` in models.ts) must sit just
// above it, never inside or through it: each of their vertices is tested against the fruit's solid body
// (its closed parts) by ray parity.
function hugOverlaps(root: THREE.Object3D): string[] {
  root.updateMatrixWorld(true)
  const probes: THREE.Mesh[] = []
  const hugs: THREE.Mesh[] = []
  const twoSided = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  root.traverse(o => {
    const m = o as THREE.Mesh
    if (!m.isMesh) return
    if (m.userData.solid) {
      const p = new THREE.Mesh(m.geometry, twoSided)
      p.matrixAutoUpdate = false
      p.matrixWorld.copy(m.matrixWorld)
      probes.push(p)
    }
    if (m.userData.hug) hugs.push(m)
  })
  const ray = new THREE.Raycaster()
  const dir = new THREE.Vector3(0.13, 0.98, 0.09).normalize()
  let inside = 0
  const v = new THREE.Vector3()
  for (const h of hugs) {
    const pos = h.geometry.getAttribute('position')
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(h.matrixWorld)
      ray.set(v, dir)
      if (ray.intersectObjects(probes, false).length % 2 === 1) inside++
    }
  }
  return inside ? [`${inside} leaf vertices inside the body`] : []
}

window.fruitIds = FRUITS.map(f => f.id)
window.renderFruit = (id, cut, turn = -0.5, after = 0) => {
  const fruit = FRUITS.find(f => f.id === id)!
  const t = tonesOf(fruit.colour)
  renderer.setClearColor(t.pop)
  ;(floor.material as THREE.ShadowMaterial).color.set(t.ink)
  const group = new THREE.Group()
  group.add(buildFruit(id, fruit.colour))
  group.scale.setScalar(SIZE)
  group.rotation.y = turn
  scene.add(group)
  let overlaps: string[] = hugOverlaps(group)
  if (cut) {
    const parts = cutParts(group)
    if (parts) {
      const c = planCut(group, parts, camera, 0.42)
      c.target = 1
      c.p = 1
      stepCut(c, 0)
      overlaps = [...overlaps, ...cutOverlaps(group, parts.map(p => p.part))]
    }
  }
  group.rotation.y += after // turn the whole scene round (the halves' skin sides)
  renderer.render(scene, camera)
  const url = canvas.toDataURL('image/png')
  scene.remove(group)
  return { url, overlaps }
}
// For debugging a layout: where each piece of a fruit ends up (world), and what overlaps.
;(window as unknown as { debugCut: (id: string) => unknown }).debugCut = (id: string) => {
  const fruit = FRUITS.find(f => f.id === id)!
  const group = new THREE.Group()
  group.add(buildFruit(id, fruit.colour))
  group.scale.setScalar(SIZE)
  group.rotation.y = -0.5
  scene.add(group)
  const parts = cutParts(group)!
  const t0 = performance.now()
  const c = planCut(group, parts, camera, 0.42)
  const ms = Math.round(performance.now() - t0)
  c.target = 1; c.p = 1; stepCut(c, 0)
  const out = parts.map(p => p.part.getWorldPosition(new THREE.Vector3()).toArray().map(v => +v.toFixed(2)))
  const ov = cutOverlaps(group, parts.map(p => p.part))
  scene.remove(group)
  return { out, ov, ms }
}

// The Now dish for a month, every fruit cut open by the Slice button (./dish.ts planDish), from the Now
// hero's camera with the dish turned to `spin`: what is wrong with it (pieces meeting, the rim, the
// bowl) and a picture.
const dishCamera = new THREE.PerspectiveCamera(33, 361 / 290, 0.1, 50) // the Now hero's camera and shape
dishCamera.position.set(0, 2.75, 4.6)
dishCamera.lookAt(0, 0.78, 0)
dishCamera.updateMatrixWorld()
const dishGeo = dishGeometry()
window.renderDish = (month, spin, cut = true) => renderDishFruits(dishFruits(FRUITS, month), seasonTones(seasonOf(month)), spin, cut)
// Any five fruit (five of one hop-type fruit, say), on that fruit's own colours.
window.renderDishOf = (ids, spin, cut = true) => renderDishFruits(ids.map(id => FRUITS.find(f => f.id === id)!), tonesOf(FRUITS.find(f => f.id === ids[0])!.colour), spin, cut)
function renderDishFruits(fruits: typeof FRUITS, tones: ReturnType<typeof tonesOf>, spin: number, cut: boolean) {
  renderer.setClearColor(tones.page)
  ;(floor.material as THREE.ShadowMaterial).color.set(tones.ink)
  const spinGroup = new THREE.Group()
  const dish = new THREE.Group()
  spinGroup.add(dish)
  spinGroup.rotation.y = spin
  const glaze = new THREE.Mesh(dishGeo, new THREE.MeshPhysicalMaterial({ color: tones.pop, roughness: 0.22, clearcoat: 1, side: THREE.DoubleSide }))
  glaze.castShadow = glaze.receiveShadow = true
  const lip = new THREE.Mesh(new THREE.TorusGeometry(RIM - 0.035, 0.05, 12, 72), new THREE.MeshPhysicalMaterial({ color: tones.light, roughness: 0.3 }))
  lip.position.y = 1.005
  lip.rotation.x = Math.PI / 2
  dish.add(glaze, lip)
  const models = fruits.map(f => buildFruit(f.id, f.colour))
  const poses = restPoses(models)
  const slots = fruits.map((_f, i) => {
    const r = poses[i]
    const slot = new THREE.Group()
    slot.add(models[i])
    slot.position.set(r.x, r.y, r.z)
    slot.quaternion.setFromEuler(r.rest)
    slot.scale.setScalar(r.scale)
    dish.add(slot)
    return slot
  })
  scene.add(spinGroup)
  spinGroup.updateMatrixWorld(true)
  // Whole, at rest (before any cut): every fruit inside the bowl, clear of the rim.
  const names = fruits.map(f => f.id)
  const atRest = dishProblems(slots, slots.map(() => null), names).map(p => `at rest: ${p}`)
  const t0 = performance.now()
  const cuts = cut ? planDish(slots, slots.map(o => cutParts(o)), dishCamera) : slots.map(() => null)
  const ms = Math.round(performance.now() - t0)
  cuts.forEach(c => { if (c) { c.target = 1; c.p = 1; stepCut(c, 0) } })
  spinGroup.updateMatrixWorld(true)
  const problems = [...atRest, ...dishProblems(slots, cuts, names)]
  renderer.render(scene, dishCamera)
  const url = canvas.toDataURL('image/png')
  scene.remove(spinGroup)
  return { url, problems, names, ms }
}
document.title = 'ready'
