import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { Controls, type Theme } from '../Controls'
import { site, type SiteVersion } from '../content'
import { Inline } from '../Inline'
import { ThreeSceneContent } from '../three/scenes'
import { isThreeScene, type ThreeScene } from '../three/types'

type Props = {
  theme: Theme
  version: SiteVersion
  onToggleTheme: () => void
  onSetVersion: (version: SiteVersion) => void
}

const SECTION_IDS = ['header', 'bio', 'timeline', 'thesis', 'projects', 'extras'] as const

function getInitialScene(): ThreeScene {
  try {
    const stored = localStorage.getItem('threeScene')
    if (stored && isThreeScene(stored)) return stored
  } catch {
    /* ignore */
  }
  return 'wave'
}

export function ThreeView({
  theme,
  version,
  onToggleTheme,
  onSetVersion,
}: Props) {
  const [scene, setScene] = useState<ThreeScene>(getInitialScene)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem('threeScene', scene)
    } catch {
      /* ignore */
    }
  }, [scene])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      setPointer({ x, y })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(`three-${id}`)).filter(
      (n): n is HTMLElement => Boolean(n),
    )
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible?.target) return
        const idx = nodes.indexOf(visible.target as HTMLElement)
        if (idx >= 0) setActiveSection(idx)
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: [0.2, 0.5, 0.8] },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="three-page"
      data-three-theme={theme}
      data-three-scene={scene}
    >
      <div className="three-canvas">
        <Canvas
          key={scene}
          camera={{ position: [0, 0.4, 5.5], fov: 50 }}
          dpr={[1, 1.75]}
        >
          <Suspense fallback={null}>
            <ThreeSceneContent
              scene={scene}
              theme={theme}
              scrollProgress={scrollProgress}
              pointer={pointer}
              activeSection={activeSection}
            />
          </Suspense>
        </Canvas>
      </div>

      <main className="three-overlay">
        <header className="three-header" id="three-header">
          <h1>{site.name}</h1>
          <p className="tagline">{site.tagline}</p>
        </header>

        <section className="three-card" id="three-bio">
          <h2>bio</h2>
          <p>{site.bio}</p>
        </section>

        <section className="three-card" id="three-timeline">
          <h2>timeline</h2>
          <div className="three-timeline">
            {site.timeline.map((entry) => (
              <article key={entry.years} className="three-entry">
                <div className="years">{entry.years}</div>
                <div>
                  {entry.paragraphs.map((parts, i) => (
                    <p key={i}>
                      <Inline parts={parts} />
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="three-card" id="three-thesis">
          <h2>thesis</h2>
          <span className="pub-title">{site.thesis.title}</span>
          <span className="pub-meta">
            {site.thesis.metaBefore}
            <a href={site.thesis.github.href} target="_blank" rel="noreferrer">
              {site.thesis.github.label}
            </a>
          </span>
          {site.thesis.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'pub-body' : undefined}>
              {p}
            </p>
          ))}
        </section>

        <section className="three-card" id="three-projects">
          <h2>projects</h2>
          <ul>
            {site.projects.map((project) => (
              <li key={project.title}>
                <span className="project-title">{project.title}</span>
                <br />
                {project.body}
              </li>
            ))}
          </ul>
        </section>

        <section className="three-card" id="three-extras">
          <h2>extras</h2>
          <div className="extras-row">
            <div className="links">
              {site.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Controls
              theme={theme}
              version={version}
              onToggleTheme={onToggleTheme}
              onSetVersion={onSetVersion}
              threeScene={scene}
              onSetThreeScene={setScene}
              className="view-controls"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
