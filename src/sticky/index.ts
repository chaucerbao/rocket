import { observable, Observable } from 'riot'
import { createElement, wrapElement } from '../lib/dom'
import scrollAction from '../lib/scroll-action'

export interface Options {
  element: HTMLElement
}

const stuckAttribute = 'data-sticky-stuck'
const placeholderAttribute = 'data-sticky-placeholder'

export default ({ element }: Options) => {
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
    {
      start: window.pageYOffset + element.getBoundingClientRect().top
    }
  )()

  return module
}
