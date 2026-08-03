import {
  VERSION_ORDER,
  VERSION_LABEL,
  type SiteVersion,
} from './content'
import {
  THREE_SCENE_ORDER,
  THREE_SCENE_LABEL,
  type ThreeScene,
} from './three/types'

export type Theme = 'light' | 'dark'

type Props = {
  theme: Theme
  version: SiteVersion
  onToggleTheme: () => void
  onSetVersion: (version: SiteVersion) => void
  threeScene?: ThreeScene
  onSetThreeScene?: (scene: ThreeScene) => void
  className?: string
}

export function Controls({
  theme,
  version,
  onToggleTheme,
  onSetVersion,
  threeScene,
  onSetThreeScene,
  className,
}: Props) {
  const others = VERSION_ORDER.filter((v) => v !== version)
  const showScenes = version === 'three' && threeScene && onSetThreeScene
  const otherScenes = showScenes
    ? THREE_SCENE_ORDER.filter((s) => s !== threeScene)
    : []

  return (
    <div className={className ?? 'view-controls'}>
      {others.map((v) => (
        <button
          key={v}
          type="button"
          className="theme-toggle"
          onClick={() => onSetVersion(v)}
          aria-label={`Switch to ${VERSION_LABEL[v]} version`}
        >
          {VERSION_LABEL[v]}
        </button>
      ))}
      {otherScenes.map((s) => (
        <button
          key={s}
          type="button"
          className="theme-toggle"
          onClick={() => onSetThreeScene?.(s)}
          aria-label={`Switch to ${THREE_SCENE_LABEL[s]} 3d scene`}
        >
          {THREE_SCENE_LABEL[s]}
        </button>
      ))}
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={
          theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
        }
      >
        {theme === 'light' ? 'dark' : 'light'}
      </button>
    </div>
  )
}
