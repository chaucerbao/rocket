// Library
import sticky from '../../../../src/sticky'
import '../../../../src/sticky/style.css'

// Example
import { $ } from '../../../../src/lib/dom'
import './example.css'

const stickyElement = $('[data-sticky]')
const container = stickyElement.parentElement
const header = $('.ndpl-header')

const stickyHandler = sticky(stickyElement, {
  end: () => {
    const containerRect = container.getBoundingClientRect()

    return (
      window.pageYOffset +
      containerRect.top +
      containerRect.height -
      stickyElement.getBoundingClientRect().height
    )
  },
  viewport: () =>
    window.innerWidth < 960 ? header.getBoundingClientRect().height : 0
})

stickyHandler.on('stick', () => console.log('Stuck'))
stickyHandler.on('unstick', () => console.log('Unstuck'))
stickyHandler.on('restick', () => console.log('Restuck'))
stickyHandler.on('end', () => console.log('End'))
