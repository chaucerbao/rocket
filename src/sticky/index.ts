import { observable, Observable } from 'riot'
import { createElement, wrapElement } from '../lib/dom'
import scrollAction, {
  Options as ScrollActionOptions
} from '../lib/scroll-action'

const stuckAttribute = 'data-sticky-stuck'
const endAttribute = 'data-sticky-end'
const placeholderAttribute = 'data-sticky-placeholder'

export default (element: HTMLElement, options: ScrollActionOptions) => {
  const module: Observable = observable({ element })

  const placeholder = createElement('div', [], { [placeholderAttribute]: '' })
  wrapElement(placeholder, element)

  scrollAction(
    (progress: number) => {
      if (progress === 0 && element.hasAttribute(stuckAttribute)) {
        element.removeAttribute(stuckAttribute)

        element.style.width = null
        placeholder.style.width = null
        placeholder.style.height = null

        module.trigger('unstick', element)
      } else if (progress > 0 && !element.hasAttribute(stuckAttribute)) {
        const elementStyle = window.getComputedStyle(element)
        const stickyRect = element.getBoundingClientRect()

        element.style.width = elementStyle.width
        placeholder.style.width = `${stickyRect.width}px`
        placeholder.style.height = `${stickyRect.height}px`

        element.setAttribute(stuckAttribute, '')

        module.trigger('stick', element)
      } else if (progress < 1 && element.hasAttribute(endAttribute)) {
        element.removeAttribute(endAttribute)

        module.trigger('restick', element)
      } else if (progress === 1 && !element.hasAttribute(endAttribute)) {
        element.setAttribute(endAttribute, '')

        module.trigger('end', element)
      }

      return true
    },
    Object.assign(
      {
        start: () =>
          window.pageYOffset + placeholder.getBoundingClientRect().top
      },
      options
    )
  )()

  return module
}
