import { resolve, Resolvable } from './utils'

export interface Options {
  start?: Resolvable<number>
  end?: Resolvable<number>
  viewport?: Resolvable<number>
}

export default (
  callback: (progress: number) => boolean,
  { start = 0, end = () => document.body.clientHeight, viewport = 0 }: Options
) => {
  const calculateFrame = () => {
    const startY = resolve(start)
    const total = resolve(end) - startY

    const viewportY = resolve(viewport)
    const current = window.pageYOffset + viewportY - startY

    const progress = Math.min(Math.max(current / total, 0), 1)

    if (callback(progress)) {
      window.requestAnimationFrame(calculateFrame)
    }
  }

  return () => window.requestAnimationFrame(calculateFrame)
}
