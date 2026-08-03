export type ThreeScene =
  | 'scroll'
  | 'react'
  | 'wave'
  | 'glyphs'

export const THREE_SCENE_ORDER: ThreeScene[] = [
  'scroll',
  'react',
  'wave',
  'glyphs',
]

export const THREE_SCENE_LABEL: Record<ThreeScene, string> = {
  scroll: 'pan',
  react: 'scrub',
  wave: 'wave',
  glyphs: 'glyphs',
}

export function isThreeScene(v: string): v is ThreeScene {
  return (THREE_SCENE_ORDER as string[]).includes(v)
}
