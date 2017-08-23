// Library
import lazyLoader from '../../../../src/lazy-loader'

const lazyHandler = lazyLoader()

lazyHandler.on('change', () => console.log('Changed'))
lazyHandler.on('load', () => console.log('Loaded'))
