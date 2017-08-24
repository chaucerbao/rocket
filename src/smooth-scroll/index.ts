import { observable, Observable } from 'riot'
import { resolve, Resolvable } from '../lib/utils'

export interface Options {
  to: Resolvable<number>
  duration: number
  easing: (progress: number) => number
}

export default ({
  to,
  duration = 500,
  easing = progress => progress
}: Options) => {
  const module: Observable = observable()

  const start = window.pageYOffset
  const total = resolve(to) - start

  const startTime = new Date().getTime()

  const smoothScroll = () => {
    const progress = Math.min(new Date().getTime() - startTime, duration)
    const current = easing(progress / duration) * total

    window.scrollTo(0, start + current)

    if (current === total) {
      module.trigger('end')
    } else {
      window.requestAnimationFrame(smoothScroll)
    }
  }

  window.requestAnimationFrame(smoothScroll)

  return module
}
