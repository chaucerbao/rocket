import { createElement, wrapElement } from '../lib/dom'
import scrollAction from '../lib/scroll-action'

export interface Options {
  element: HTMLElement
}

const stuckAttribute = 'data-sticky-stuck'
const placeholderAttribute = 'data-sticky-placeholder'

export default ({ element }: Options) => {
  const placeholder = createElement('div', [], { [placeholderAttribute]: '' })

  wrapElement(placeholder, element)

  const startSticky = scrollAction(
    (progress: number) => {
      if (progress === 0 && element.hasAttribute(stuckAttribute)) {
        element.removeAttribute(stuckAttribute)

        element.style.width = null
        placeholder.style.width = null
        placeholder.style.height = null
      } else if (progress > 0 && !element.hasAttribute(stuckAttribute)) {
        element.style.width = window.getComputedStyle(element).width

        const stickyRect = element.getBoundingClientRect()
        placeholder.style.width = `${stickyRect.width}px`
        placeholder.style.height = `${stickyRect.height}px`

        element.setAttribute(stuckAttribute, '')
      }

      return true
    },
    {
      start: window.pageYOffset + element.getBoundingClientRect().top
    }
  )

  return {
    frameID: startSticky()
  }
}
