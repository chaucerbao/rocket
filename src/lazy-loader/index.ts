import { observable, Observable } from 'riot'
import { $$ } from '../lib/dom'
import { each } from '../lib/utils'
import scrollAction, {
  Options as ScrollActionOptions
} from '../lib/scroll-action'

export interface Options extends ScrollActionOptions {}

const lazyAttribute = 'data-src'
const loadedAttribute = 'data-lazy-loaded'

export default (options: Options) => {
  const elements = $$(`[${lazyAttribute}]:not([${loadedAttribute}])`)
  const module: Observable = observable({ elements })

  each(elements, (element: HTMLElement) => {
    element.addEventListener('load', () => module.trigger('load', element))

    scrollAction(
      (progress: number) => {
        if (progress > 0 && !element.hasAttribute(loadedAttribute)) {
          element.setAttribute('src', element.getAttribute(lazyAttribute)!)
          element.removeAttribute(lazyAttribute)

          element.setAttribute(loadedAttribute, '')

          module.trigger('change', element)

          return false
        }

        return true
      },
      Object.assign(
        {
          start: () => window.pageYOffset + element.getBoundingClientRect().top,
          viewport: () => window.innerHeight
        },
        options
      )
    )()
  })

  return module
}
