export interface Options {
  start?: number
  end?: number
  viewport?: number | 'top' | 'middle' | 'bottom'
}

export default (
  callback: (progress: number) => boolean,
  { start = 0, end = document.body.clientHeight, viewport = 0 }: Options = {}
) => {
  const total = end - start

  const calculateFrame = () => {
    let viewportOffset

    if (typeof viewport == 'number') {
      viewportOffset = viewport
    } else {
      switch (viewport) {
        case 'bottom':
          viewportOffset = window.innerHeight
          break
        case 'middle':
          viewportOffset = window.innerHeight * 0.5
          break
        default:
          viewportOffset = 0
      }
    }

    const trigger = window.pageYOffset + viewportOffset
    const current = trigger - start
    const progress = Math.min(Math.max(current / total, 0), 1)

    if (callback(progress)) {
      requestAnimationFrame(calculateFrame)
    }
  }

  return () => window.requestAnimationFrame(calculateFrame)
}
