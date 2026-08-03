import { Float, OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BufferAttribute, Color, type Group, type Mesh } from 'three'
import type { Theme } from '../Controls'
import { sceneColors, spectralEnergy } from './theme'
import type { ThreeScene } from './types'

export type SceneProps = {
  theme: Theme
  scrollProgress: number
  pointer: { x: number; y: number }
  activeSection: number
}

function Lights({ theme }: { theme: Theme }) {
  const c = sceneColors(theme)
  return (
    <>
      <color attach="background" args={[c.fog]} />
      <ambientLight intensity={c.ambient} />
      <directionalLight position={[4, 7, 3]} intensity={1.05} />
      <pointLight position={[-2.5, 2, 2]} intensity={0.55} color={c.accent} />
      <pointLight position={[3, 1, -1]} intensity={0.35} color={c.accentWarm} />
    </>
  )
}

/** Faint time × frequency frame — instrument chrome, not starfield. */
function SpecGrid({ theme }: { theme: Theme }) {
  const c = sceneColors(theme)
  return (
    <group position={[0, -0.2, -1.5]} rotation={[-0.2, 0.15, 0]}>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={`v${i}`} position={[-4 + i, 1.2, 0]}>
          <boxGeometry args={[0.01, 2.4, 0.01]} />
          <meshBasicMaterial color={c.grid} transparent opacity={0.22} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`h${i}`} position={[0, i * 0.4, 0]}>
          <boxGeometry args={[8, 0.01, 0.01]} />
          <meshBasicMaterial color={c.grid} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  )
}

function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree()
  useFrame(() => {
    const t = progress
    camera.position.x += (t * 4.5 - 1.2 - camera.position.x) * 0.05
    camera.position.y += (1.4 + t * 0.8 - camera.position.y) * 0.05
    camera.position.z += (5.5 - t * 0.6 - camera.position.z) * 0.05
    camera.lookAt(t * 3.5, 0.4, 0)
  })
  return null
}

function ensureColorAttr(mesh: Mesh) {
  const geo = mesh.geometry
  if (geo.getAttribute('color')) return
  const count = geo.attributes.position.count
  geo.setAttribute('color', new BufferAttribute(new Float32Array(count * 3), 3))
}

/** STFT-style spectrogram: X = time, Y = frequency, Z = energy. */
function SpectrogramPlane({
  theme,
  pointer,
  interactive = false,
  position = [0, 0.15, 0],
  rotation = [-0.55, 0.1, 0],
  scrollBoost = 0,
  wireframe = false,
}: {
  theme: Theme
  pointer: { x: number; y: number }
  interactive?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
  scrollBoost?: number
  wireframe?: boolean
}) {
  const mesh = useRef<Mesh>(null)
  const cols = 72
  const rows = 36
  const c = sceneColors(theme)
  const colorA = useMemo(() => new Color(c.accent), [c.accent])
  const colorB = useMemo(() => new Color(c.accentWarm), [c.accentWarm])
  const colorC = useMemo(() => new Color(c.accentHot), [c.accentHot])
  const scratch = useMemo(() => new Color(), [])

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    ensureColorAttr(m)
    const pos = m.geometry.attributes.position
    const colors = m.geometry.attributes.color
    const t = state.clock.elapsedTime + scrollBoost * 10
    const px = interactive ? pointer.x : Math.sin(t * 0.2) * 0.15
    const py = interactive ? pointer.y : 0

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const u = (x + 5) / 10
      const v = (y + 1.6) / 3.2
      let e = spectralEnergy(u, v, t * 0.4, px)
      if (interactive) {
        const band = Math.exp(-((v - (0.5 + py * 0.45)) ** 2) * 14)
        e = Math.min(1, e * (0.7 + band * 0.9))
      }
      pos.setZ(i, e * 0.9)
      scratch.copy(colorA).lerp(colorB, Math.min(1, e * 1.1)).lerp(colorC, e * e)
      colors.setXYZ(i, scratch.r, scratch.g, scratch.b)
    }
    pos.needsUpdate = true
    colors.needsUpdate = true
    m.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={mesh} position={position} rotation={rotation}>
      <planeGeometry args={[10, 3.2, cols, rows]} />
      <meshStandardMaterial
        vertexColors
        wireframe={wireframe}
        roughness={0.4}
        metalness={0.2}
        flatShading
      />
    </mesh>
  )
}

/** Acoustic-emission amplitude trace (time-domain). */
function WaveformRibbon({
  accent,
  accentWarm,
  pointer,
  interactive = false,
}: {
  accent: string
  accentWarm: string
  pointer: { x: number; y: number }
  interactive?: boolean
}) {
  const line = useRef<Group>(null)
  const segs = 160

  useFrame((state) => {
    const g = line.current
    if (!g) return
    const t = state.clock.elapsedTime
    const px = interactive ? pointer.x : 0
    g.children.forEach((child, i) => {
      const u = i / (segs - 1)
      const x = -5 + u * 10
      const env = Math.exp(-((u - 0.5 - px * 0.25) ** 2) * 8)
      const ae =
        Math.sin(u * 48 + t * 6) * 0.35 * env +
        Math.sin(u * 90 - t * 9) * 0.12 * env +
        Math.sin(u * 12 + t * 2) * 0.08
      const y = ae * (1 + (interactive ? pointer.y * 0.4 : 0))
      child.position.set(x, y, 0)
      child.scale.setScalar(0.03 + Math.abs(ae) * 0.08)
    })
  })

  return (
    <group ref={line} position={[0, 0.3, 0]}>
      {Array.from({ length: segs }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? accentWarm : accent}
            emissive={i % 7 === 0 ? accentWarm : accent}
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Sliding STFT analysis window. */
function StftWindow({
  accent,
  pointer,
}: {
  accent: string
  pointer: { x: number; y: number }
}) {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const x = pointer.x * 3.5 + Math.sin(t * 0.7) * 0.3
    ref.current.position.x += (x - ref.current.position.x) * 0.12
  })
  return (
    <mesh ref={ref} position={[0, 0.4, 0.6]} rotation={[-0.55, 0.1, 0]}>
      <planeGeometry args={[1.1, 3.0]} />
      <meshStandardMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={0.5}
        transparent
        opacity={0.28}
        wireframe
      />
    </mesh>
  )
}

const GLYPH_KINDS = ['wave', 'spec', 'window', 'bins', 'label'] as const

function AudioGlyph({
  accent,
  accentWarm,
  activeSection,
}: {
  accent: string
  accentWarm: string
  activeSection: number
}) {
  const group = useRef<Group>(null)
  const kind = GLYPH_KINDS[activeSection % GLYPH_KINDS.length]
  const color = activeSection % 2 === 0 ? accent : accentWarm

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.45
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.04
    group.current.scale.setScalar(pulse)
  })

  return (
    <Float speed={1.2} floatIntensity={0.7}>
      <group ref={group} position={[2.4, 0.5, 0.8]}>
        {kind === 'wave' && (
          <mesh>
            <torusGeometry args={[0.55, 0.06, 8, 48]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              wireframe
            />
          </mesh>
        )}
        {kind === 'spec' && (
          <mesh rotation={[-0.5, 0.3, 0]}>
            <planeGeometry args={[1.2, 0.8, 12, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              wireframe
            />
          </mesh>
        )}
        {kind === 'window' && (
          <mesh>
            <boxGeometry args={[0.35, 1.1, 0.08]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              wireframe
            />
          </mesh>
        )}
        {kind === 'bins' && (
          <group>
            {[0.4, 0.7, 1.0, 0.55, 0.85].map((h, i) => (
              <mesh
                key={i}
                position={[(i - 2) * 0.22, h * 0.5 - 0.4, 0]}
                scale={[0.14, h, 0.14]}
              >
                <boxGeometry />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.35}
                />
              </mesh>
            ))}
          </group>
        )}
        {kind === 'label' && (
          <mesh>
            <octahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              wireframe
            />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function SoftOrbit() {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      autoRotate
      autoRotateSpeed={0.18}
      maxPolarAngle={Math.PI * 0.62}
      minPolarAngle={Math.PI * 0.38}
    />
  )
}

export function ThreeSceneContent({
  scene,
  theme,
  scrollProgress,
  pointer,
  activeSection,
}: SceneProps & { scene: ThreeScene }) {
  const c = sceneColors(theme)

  return (
    <>
      <Lights theme={theme} />
      <fog attach="fog" args={[c.fog, c.fogNear, c.fogFar]} />
      <SpecGrid theme={theme} />

      {scene === 'scroll' && (
        <>
          <SpectrogramPlane
            theme={theme}
            pointer={pointer}
            scrollBoost={scrollProgress}
          />
          <ScrollCamera progress={scrollProgress} />
        </>
      )}

      {scene === 'react' && (
        <>
          <SpectrogramPlane theme={theme} pointer={pointer} interactive />
          <StftWindow accent={c.accentWarm} pointer={pointer} />
          <SoftOrbit />
        </>
      )}

      {scene === 'wave' && (
        <>
          <WaveformRibbon
            accent={c.accent}
            accentWarm={c.accentWarm}
            pointer={pointer}
            interactive
          />
          <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[11, 3]} />
            <meshBasicMaterial color={c.grid} transparent opacity={0.12} />
          </mesh>
          <SoftOrbit />
        </>
      )}

      {scene === 'glyphs' && (
        <>
          <SpectrogramPlane
            theme={theme}
            pointer={pointer}
            interactive
            position={[0, 0.1, -0.4]}
            wireframe
          />
          <WaveformRibbon
            accent={c.accent}
            accentWarm={c.accentHot}
            pointer={pointer}
            interactive
          />
          <AudioGlyph
            accent={c.accent}
            accentWarm={c.accentWarm}
            activeSection={activeSection}
          />
          <SoftOrbit />
        </>
      )}
    </>
  )
}
