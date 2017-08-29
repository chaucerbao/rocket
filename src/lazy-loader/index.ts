import { observable, Observable } from 'riot'
import { $$ } from '../lib/dom'
import { each } from '../lib/utils'
import scrollAction, {
  Options as ScrollActionOptions
} from '../lib/scroll-action'

export interface Options extends ScrollActionOptions {
  context?: HTMLElement
}

const lazyAttribute = 'data-lazy'
const loadedAttribute = 'data-lazy-loaded'

export default (options: Options = { context: undefined }) => {
  const { context } = options
  const elements = $$(`[${lazyAttribute}]`, context)
  const module: Observable = observable({ elements })

  each(elements, (element: HTMLElement) => {
    element.addEventListener('load', () => module.trigger('load', element))

    scrollAction(
      (progress: number) => {
        if (progress > 0) {
          module.trigger(
            'trigger',
            element,
            element.getAttribute(lazyAttribute)
          )

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
  })

  return module
}
