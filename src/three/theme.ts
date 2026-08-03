import type { Theme } from '../Controls'

/** Cool instrument / spectrogram palette (time–freq lab, not neon club). */
export function sceneColors(theme: Theme) {
  const light = theme === 'light'
  return {
    accent: light ? '#1f6f8b' : '#5ec8e0',
    accentWarm: light ? '#c45c26' : '#f0a060',
    accentHot: light ? '#b33b5a' : '#ff7a9a',
    fog: light ? '#e7eef2' : '#070b10',
    fogNear: light ? 7 : 4.5,
    fogFar: light ? 20 : 14,
    ambient: light ? 0.75 : 0.32,
    grid: light ? '#9aabb8' : '#2a3540',
  }
}

/** Fake spectral energy in [0,1] — bursts, harmonics, noise floor. */
export function spectralEnergy(
  time: number,
  freq: number,
  t: number,
  pointerX = 0,
): number {
  const sweep = 0.55 + 0.45 * Math.sin(time * 2.1 + t * 1.4)
  const harm =
    Math.exp(-((freq - 0.35 * sweep) ** 2) * 18) * 0.9 +
    Math.exp(-((freq - 0.62 * sweep) ** 2) * 22) * 0.55 +
    Math.exp(-((freq - 0.18) ** 2) * 40) * 0.25
  const burst =
    Math.exp(-((time - ((t * 0.15) % 1)) ** 2) * 60) *
    (0.5 + 0.5 * Math.sin(freq * 20 + t))
  const noise = 0.06 * (0.5 + 0.5 * Math.sin(time * 40 + freq * 30 + t * 3))
  const scrub = Math.exp(-((time - (0.5 + pointerX * 0.45)) ** 2) * 28) * 0.35
  return Math.min(1, harm * sweep + burst + noise + scrub)
}
