// Library
import lazyTrigger from '../../../../src/lazy-trigger'

// Example
const lazyHandler = lazyTrigger({
  viewport: () => window.innerHeight * 0.75
})

lazyHandler.on('trigger', (element, value) => {
  element.setAttribute('src', value)
  console.log('Triggered')
})
lazyHandler.on('load', () => console.log('Loaded'))
