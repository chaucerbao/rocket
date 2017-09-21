import { observable, Observable } from 'riot'
import { resolve, Resolvable } from '../lib/utils'
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
  const remainingElements = new Set(elements)

  scrollAction((_progress: number) => {
    const viewportY = resolve(viewport)
    const pendingElements = new Set()

    remainingElements.forEach(element => {
      if (element.getBoundingClientRect().top < viewportY) {
        pendingElements.add(element)
        remainingElements.delete(element)
      }
    })

    pendingElements.forEach(element => {
      const lazyValue = element.getAttribute(lazyAttribute)

      element.addEventListener('load', () =>
        module.trigger('load', element, lazyValue)
      )

      module.trigger('trigger', element, lazyValue)

      element.removeAttribute(lazyAttribute)
      element.setAttribute(loadedAttribute, '')
    })

    return remainingElements.size > 0
  })()

  return module
}
