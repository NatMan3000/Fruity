// Dev-only check page for the 3D fruit (models.html, driven by scripts/model-sheet.ts): renders one
// fruit at a time, whole or cut open, from the fruit page's camera and light, and hands back a PNG.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { FRUITS } from '../assets/fruits'
import { cutParts, buildFruit } from '../three/models'
import { cutOverlaps, planCut, stepCut } from '../three/cutting'
import { tonesOf } from '../utils/tones'

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
key.position.set(2.5, 5, 3)
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
  interface Window { renderFruit: (id: string, cut: boolean, turn?: number) => { url: string; overlaps: string[] }; fruitIds: string[] }
}

window.fruitIds = FRUITS.map(f => f.id)
window.renderFruit = (id, cut, turn = -0.5) => {
  const fruit = FRUITS.find(f => f.id === id)!
  const t = tonesOf(fruit.colour)
  renderer.setClearColor(t.pop)
  ;(floor.material as THREE.ShadowMaterial).color.set(t.ink)
  const group = new THREE.Group()
  group.add(buildFruit(id, fruit.colour))
  group.scale.setScalar(SIZE)
  group.rotation.y = turn
  scene.add(group)
  let overlaps: string[] = []
  if (cut) {
    const parts = cutParts(group)
    if (parts) {
      const c = planCut(group, parts, camera, 0.42)
      c.target = 1
      c.p = 1
      stepCut(c, 0)
      overlaps = cutOverlaps(group, parts.map(p => p.part))
    }
  }
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
document.title = 'ready'
