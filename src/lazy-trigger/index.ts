import { observable, Observable } from 'riot'
import { each, resolve, Resolvable } from '../lib/utils'
import scrollAction from '../lib/scroll-action'

export interface Options {
  viewport?: Resolvable<number>
}

const lazyAttribute = 'data-lazy'
const loadedAttribute = 'data-lazy-loaded'

export default (
  elements: HTMLElement[],
  { viewport = () => window.innerHeight }: Options = {}
) => {
  const module: Observable = observable()
  const pendingElements = new Set(elements)

  scrollAction((_progress: number) => {
    const queue: HTMLElement[] = []
    const viewportY = resolve(viewport)

    pendingElements.forEach(element => {
      if (element.getBoundingClientRect().top < viewportY) {
        queue.push(element)
      }
    })

    each(queue, element => {
      const lazyValue = element.getAttribute(lazyAttribute)

      element.addEventListener('load', () =>
        module.trigger('load', element, lazyValue)
      )

      module.trigger('trigger', element, lazyValue)

      element.removeAttribute(lazyAttribute)
      element.setAttribute(loadedAttribute, '')

      pendingElements.delete(element)
    })

    return pendingElements.size > 0
  })()

  return module
}
