// Library
import carousel from '../../../../src/carousel'
import '../../../../src/carousel/style.css'

// Example
import { $, $$ } from '../../../../src/lib/dom'
import { each } from '../../../../src/lib/utils'
import './example.css'

const carouselHandler = carousel({
  element: document.querySelector('[data-carousel]'),
  infinite: true
})

$('.carousel-example__previous-button').addEventListener('click', () =>
  carouselHandler.previous()
)
each($$('.carousel-example__slide-button'), (button, i) =>
  button.addEventListener('click', () => carouselHandler.goTo(i))
)
$('.carousel-example__next-button').addEventListener('click', () =>
  carouselHandler.next()
)

carouselHandler.on('slide', i => console.log('Slide', i))
carouselHandler.on('touchstart', i => console.log('Touch Start'))
carouselHandler.on('touchend', i => console.log('Touch End'))
