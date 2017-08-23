// Library
import lazyLoader from '../../../../src/lazy-loader'

// Example
const lazyHandler = lazyLoader()

lazyHandler.on('change', () => console.log('Changed'))
lazyHandler.on('load', () => console.log('Loaded'))
