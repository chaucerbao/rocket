// Library
import lazyLoader from '../../../../src/lazy-loader'

// Example
const lazyHandler = lazyLoader({
  viewport: () => window.innerHeight * 0.75
})

lazyHandler.on('trigger', (element, value) => {
  element.setAttribute('src', value)
  console.log('Triggered')
})
lazyHandler.on('load', () => console.log('Loaded'))
