import { $$ } from '../lib/selector'
import each from '../lib/each'
import scrollAction from '../lib/scroll-action'

const stuckAttribute = 'data-sticky-stuck'
const placeholderAttribute = 'data-sticky-placeholder'

export default () => {
  each($$('[data-sticky]'), (stickyElement: HTMLElement) => {
    // Create a placeholder around the sticky element
    const placeholder = document.createElement('div')
    placeholder.setAttribute(placeholderAttribute, '')
    stickyElement.insertAdjacentElement('beforebegin', placeholder)
    placeholder.appendChild(stickyElement)

    const startSticky = scrollAction(
      (progress: number) => {
        if (progress > 0 && !stickyElement.hasAttribute(stuckAttribute)) {
          stickyElement.style.width = window.getComputedStyle(
            stickyElement
          ).width

          const stickyRect = stickyElement.getBoundingClientRect()
          placeholder.style.width = `${stickyRect.width}px`
          placeholder.style.height = `${stickyRect.height}px`

          stickyElement.setAttribute(stuckAttribute, '')
        } else if (
          progress <= 0 &&
          stickyElement.hasAttribute(stuckAttribute)
        ) {
          stickyElement.removeAttribute(stuckAttribute)

          stickyElement.style.width = null
          placeholder.style.width = null
          placeholder.style.height = null
        }

        return true
      },
      {
        start: window.pageYOffset + stickyElement.getBoundingClientRect().top
      }
    )

    startSticky()
  })
}
