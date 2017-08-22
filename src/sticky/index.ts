import { observable, Observable } from 'riot'
import { createElement, wrapElement } from '../lib/dom'
import scrollAction, {
  Options as ScrollActionOptions
} from '../lib/scroll-action'

export interface Options extends ScrollActionOptions {
  element: HTMLElement
}

const stuckAttribute = 'data-sticky-stuck'
const placeholderAttribute = 'data-sticky-placeholder'

export default (options: Options) => {
  const { element } = options
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
        element.style.width = window.getComputedStyle(element).width

        const stickyRect = element.getBoundingClientRect()
        placeholder.style.width = `${stickyRect.width}px`
        placeholder.style.height = `${stickyRect.height}px`

        element.setAttribute(stuckAttribute, '')

        module.trigger('stick', element)
      }

      return true
    },
    Object.assign(
      {
        start: window.pageYOffset + element.getBoundingClientRect().top
      },
      options
    )
  )()

  return module
}
