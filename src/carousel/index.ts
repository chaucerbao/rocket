import { observable, Observable } from 'riot'
import { createElement } from '../lib/dom'
import { each } from '../lib/utils'

export interface Options {
  element: HTMLElement
  infinite?: boolean
}

const carouselAttribute = 'data-carousel'
const sliderAttribute = 'data-carousel-slider'
const slideAttribute = 'data-carousel-slide'
const jumpAttribute = 'data-carousel-slider-jump'

const scaffold = (element: HTMLElement, options: Options) => {
  const slides: HTMLElement[] = []

  each(element.children, (slide: HTMLElement) => {
    slide.setAttribute(slideAttribute, '')
    slides.push(slide)
  })

  if (options.infinite) {
    slides.unshift(slides[slides.length - 1].cloneNode(true) as HTMLElement)
    slides.push(slides[1].cloneNode(true) as HTMLElement)
  }

  const slider = createElement('div', [], { [sliderAttribute]: '' })
  const slideCount = slides.length

  slider.style.width = `${slideCount * 100}%`
  slides.forEach(slide => slider.appendChild(slide))

  element.appendChild(slider)
  element.setAttribute(carouselAttribute, '')

  return {
    element,
    slider,
    slides
  }
}

export default (element: HTMLElement, options: Options) => {
  const module: Observable = observable()
  const { infinite = false } = options

  const { slider, slides } = scaffold(element, options)
  const slideCount = slides.length
  let slideIndex = infinite ? 1 : 0
  let isTransitioning = false

  slider.addEventListener('transitionend', () => {
    isTransitioning = false

    if (infinite) {
      if (slideIndex === 0) {
        slideIndex = slideCount - 2
      } else if (slideIndex === slideCount - 1) {
        slideIndex = 1
      }

      slider.setAttribute(jumpAttribute, '')
      transitionTo(slideIndex)
    }

    window.requestAnimationFrame(() => {
      if (slider.hasAttribute(jumpAttribute)) {
        slider.removeAttribute(jumpAttribute)
      }

      module.trigger('slide', infinite ? slideIndex - 1 : slideIndex)
    })
  })

  const transitionTo = (i: number, shouldWait = false) => {
    const targetIndex = Math.min(Math.max(i, 0), slideCount - 1)
    isTransitioning = (shouldWait && targetIndex !== slideIndex) || !!touchStart
    slider.style.transform = `translateX(${-targetIndex * 100 / slideCount}%)`
    slideIndex = targetIndex
  }

  const goTo = (i: number) => {
    if (isTransitioning) return
    transitionTo(infinite ? i + 1 : i, true)
  }

  const previous = () => {
    if (isTransitioning) return
    transitionTo(slideIndex - 1, true)
  }

  const next = () => {
    if (isTransitioning) return
    transitionTo(slideIndex + 1, true)
  }

  // Touch controls
  let touchStart: Touch | undefined
  let touchMove: Touch | undefined

  const moveSlider = () => {
    if (touchStart && touchMove) {
      slider.style.transform = `translateX(${-slideIndex *
        100 /
        slideCount}%) translateX(${touchMove.clientX - touchStart.clientX}px)`

      window.requestAnimationFrame(moveSlider)
    }
  }

  slider.addEventListener('touchstart', e => {
    if (isTransitioning) return

    touchStart = touchMove = e.targetTouches[0]

    slider.setAttribute(jumpAttribute, '')
    moveSlider()

    module.trigger('touchstart')
  })

  slider.addEventListener('touchmove', e => {
    touchMove = e.targetTouches[0]
  })

  slider.addEventListener('touchend', () => {
    if (touchStart && touchMove) {
      const touchMoveX = touchMove.clientX
      const touchStartX = touchStart.clientX
      const threshold = element.getBoundingClientRect().width * 0.3

      slider.removeAttribute(jumpAttribute)
      if (touchMoveX - touchStartX > threshold) {
        previous()
      } else if (touchStartX - touchMoveX > threshold) {
        next()
      } else {
        goTo(infinite ? slideIndex - 1 : slideIndex)
      }
    }

    touchStart = touchMove = undefined

    module.trigger('touchend')
  })

  transitionTo(slideIndex)

  return Object.assign(module, {
    goTo,
    previous,
    next
  })
}
