import { lazy, Suspense, useEffect, useState } from 'react'
import type { Theme } from './Controls'
import { type SiteVersion } from './content'
import { ClassicView } from './views/ClassicView'
import { TerminalView } from './views/TerminalView'

const ThreeView = lazy(() =>
  import('./views/ThreeView').then((m) => ({ default: m.ThreeView })),
)

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'light'
}

function getInitialVersion(): SiteVersion {
  try {
    const stored = localStorage.getItem('version')
    if (stored === 'classic' || stored === 'three' || stored === 'terminal') {
      return stored
    }
  } catch {
    /* ignore */
  }
  return 'classic'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [version, setVersion] = useState<SiteVersion>(getInitialVersion)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-version', version)
    try {
      localStorage.setItem('theme', theme)
      localStorage.setItem('version', version)
    } catch {
      /* ignore */
    }
  }, [theme, version])

  const shared = {
    theme,
    version,
    onToggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    onSetVersion: setVersion,
  }

  if (version === 'three') {
    return (
      <Suspense
        fallback={
          <main className="page">
            <p className="tagline">loading 3d…</p>
          </main>
        }
      >
        <ThreeView {...shared} />
      </Suspense>
    )
  }
  if (version === 'terminal') return <TerminalView {...shared} />
  return <ClassicView {...shared} />
}

export default App
