// Shared 3D plumbing for the lazy hero chunk: the canvas (render on demand, dpr capped at 2,
// transparent so the page's sorbet shows through), studio lighting with a generated room for
// reflections, and a shadow catcher tinted in the page's ink.
import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export function Stage({ children, camera, className, style, keyLight = [2.5, 5, 3] }: {
  children: ReactNode
  camera: { position: [number, number, number]; fov: number; target: [number, number, number] }
  className?: string
  style?: CSSProperties
  keyLight?: [number, number, number] // the shadow-casting light; higher means shorter shadows
}) {
  return (
    // pan-y: a vertical swipe over the canvas still scrolls the page and sideways drags reach the scene;
    // a press that starts on the fruit page's fruit cancels its own touchmoves (motion.ts useTrackball).
    <div className={className} style={{ ...style, touchAction: 'pan-y' }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: camera.position, fov: camera.fov, near: 0.1, far: 50 }}
        onCreated={({ gl, camera: cam }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.05
          cam.lookAt(...camera.target)
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <Lights keyLight={keyLight} />
        {children}
      </Canvas>
    </div>
  )
}

function Lights({ keyLight }: { keyLight: [number, number, number] }) {
  const get = useThree(s => s.get)
  useEffect(() => {
    const { gl, scene, invalidate } = get()
    const pm = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const env = pm.fromScene(room, 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.55
    invalidate()
    return () => {
      scene.environment = null
      env.dispose()
      pm.dispose()
      room.dispose()
    }
  }, [get])
  return (
    <>
      <hemisphereLight args={['#FFF4E0', '#6A3A5A', 1.1]} />
      <directionalLight
        position={keyLight}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-2.8}
        shadow-camera-right={2.8}
        shadow-camera-top={2.8}
        shadow-camera-bottom={-2.8}
        shadow-camera-near={1}
        shadow-camera-far={12}
      />
      <directionalLight position={[-3, 2.5, -3]} intensity={1.4} color="#FFE8F0" />
    </>
  )
}

// A floor that shows only the shadows, tinted with the page's ink so they read as coloured shade.
export function ShadowFloor({ colour, opacity = 0.4 }: { colour: string; opacity?: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.012} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <shadowMaterial color={colour} opacity={opacity} transparent />
    </mesh>
  )
}
