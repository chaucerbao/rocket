// Library
import sticky from '../../../../src/sticky'
import '../../../../src/sticky/style.css'

// Example
import './example.css'

const stickyElement = sticky({
  element: document.querySelector('[data-sticky]')
})

stickyElement.on('stick', () => {
  console.log('Stuck')
})

stickyElement.on('unstick', () => {
  console.log('Unstuck')
})
