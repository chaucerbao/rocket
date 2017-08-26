// Library
import carousel from '../../../../src/carousel'
import '../../../../src/carousel/style.css'

// Example
import { $ } from '../../../../src/lib/dom.ts'
import './example.css'

const carouselHandler = carousel({
  element: document.querySelector('[data-carousel]')
})

$('.carousel-example__previous-button').addEventListener('click', () =>
  carouselHandler.previous()
)
$('.carousel-example__next-button').addEventListener('click', () =>
  carouselHandler.next()
)

carouselHandler.on('slide', i => console.log('Slide', i))
