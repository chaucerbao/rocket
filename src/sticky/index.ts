import { $$ } from '../lib/dom'
import each from '../lib/each'
import scrollAction from '../lib/scroll-action'

const stuckAttribute = 'data-sticky-stuck'

export default () => {
  each($$('[data-sticky]'), (stickyElement: HTMLElement) => {
    // Create a placeholder around the sticky element
    const placeholder = document.createElement('div')
    placeholder.setAttribute('data-sticky-placeholder', '')
    stickyElement.insertAdjacentElement('beforebegin', placeholder)
    placeholder.appendChild(stickyElement)

    const startSticky = scrollAction(
      (progress: number) => {
        if (progress === 0 && stickyElement.hasAttribute(stuckAttribute)) {
          stickyElement.removeAttribute(stuckAttribute)

          stickyElement.style.width = null
          placeholder.style.width = null
          placeholder.style.height = null
        } else if (
          progress > 0 &&
          !stickyElement.hasAttribute(stuckAttribute)
        ) {
          stickyElement.style.width = window.getComputedStyle(
            stickyElement
          ).width

          const stickyRect = stickyElement.getBoundingClientRect()
          placeholder.style.width = `${stickyRect.width}px`
          placeholder.style.height = `${stickyRect.height}px`

          stickyElement.setAttribute(stuckAttribute, '')
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
