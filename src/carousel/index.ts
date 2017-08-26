import { observable, Observable } from 'riot'
import { createElement } from '../lib/dom'
import { each } from '../lib/utils'

export interface Options {
  element: HTMLElement
}

const carouselAttribute = 'data-carousel'
const sliderAttribute = 'data-carousel-slider'
const slideAttribute = 'data-carousel-slide'
const transitionAttribute = 'data-carousel-slider-transition'

export default (options: Options) => {
  const module: Observable = observable()
  const { element: carousel } = options
  const slides: HTMLElement[] = []
  const slideCount = carousel.children.length
  let slideIndex = 0

  each(carousel.children, (slide: HTMLElement) => {
    slide.setAttribute(slideAttribute, '')
    slides.push(slide)
  })

  const slider = createElement('div', [], { [sliderAttribute]: '' })
  slider.style.width = `${slideCount * 100}%`

  while (carousel.firstChild) {
    slider.appendChild(carousel.firstChild)
  }
  carousel.appendChild(slider)
  carousel.setAttribute(carouselAttribute, '')

  // Controls
  const goTo = (i: number) => {
    slideIndex = (i % slideCount + slideCount) % slideCount
    slider.style.transform = `translateX(${-slideIndex * 100 / slideCount}%)`

    module.trigger('slide', slideIndex)
  }
  const previous = () => goTo(slideIndex - 1)
  const next = () => goTo(slideIndex + 1)

  // Touch controls
  let touchStartX: number | undefined
  let touchMoveX: number | undefined

  const touchMove = () => {
    if (touchStartX && touchMoveX) {
      slider.style.transform = `translateX(${-slideIndex *
        100 /
        slideCount}%) translateX(${touchMoveX - touchStartX}px)`
      window.requestAnimationFrame(touchMove)
    }
  }

  slider.addEventListener('touchstart', e => {
    slider.setAttribute(transitionAttribute, '')
    touchStartX = touchMoveX = e.targetTouches[0].clientX
    touchMove()
  })
  slider.addEventListener('touchmove', e => {
    touchMoveX = e.targetTouches[0].clientX
  })
  slider.addEventListener('touchend', () => {
    if (touchStartX && touchMoveX) {
      const threshold = carousel.getBoundingClientRect().width * 0.35

      slider.removeAttribute(transitionAttribute)
      if (touchMoveX - touchStartX > threshold) {
        previous()
      } else if (touchStartX - touchMoveX > threshold) {
        next()
      } else {
        goTo(slideIndex)
      }
    }

    touchStartX = touchMoveX = undefined
  })

  return Object.assign(module, {
    slideIndex,
    goTo,
    previous,
    next
  })
}
