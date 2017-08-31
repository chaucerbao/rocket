import { observable, Observable } from 'riot'
import scrollAction, {
  Options as ScrollActionOptions
} from '../lib/scroll-action'

const lazyAttribute = 'data-lazy'
const loadedAttribute = 'data-lazy-loaded'

export default (element: HTMLElement, options: ScrollActionOptions) => {
  const module: Observable = observable()
  const lazyValue = element.getAttribute(lazyAttribute)

  element.addEventListener('load', () =>
    module.trigger('load', element, lazyValue)
  )

  scrollAction(
    (progress: number) => {
      if (progress > 0) {
        module.trigger('trigger', element, lazyValue)

        element.removeAttribute(lazyAttribute)
        element.setAttribute(loadedAttribute, '')

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

  return module
}
