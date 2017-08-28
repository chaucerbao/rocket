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

export default (options: Options) => {
  const module: Observable = observable()
  const { element, infinite = false } = options

  const { slider, slides } = scaffold(element, options)
  const slideCount = slides.length
  let slideIndex = infinite ? 1 : 0

  let isTransitioning = false
  slider.addEventListener('transitionend', () => {
    isTransitioning = false
    window.requestAnimationFrame(() =>
      module.trigger('slide', infinite ? slideIndex - 1 : slideIndex)
    )
  })

  const transitionTo = (i: number, shouldWait = false) => {
    const targetIndex = Math.min(Math.max(i, 0), slideCount - 1)
    isTransitioning = shouldWait && targetIndex !== slideIndex
    slider.style.transform = `translateX(${-targetIndex * 100 / slideCount}%)`
    slideIndex = targetIndex
  }

  const wrapAround = () => {
    slider.removeEventListener('transitionend', wrapAround)

    slider.setAttribute(jumpAttribute, '')
    if (slideIndex === 0) {
      slideIndex = slideCount - 2
    } else if (slideIndex === slideCount - 1) {
      slideIndex = 1
    }
    transitionTo(slideIndex)
    window.requestAnimationFrame(() => slider.removeAttribute(jumpAttribute))
  }

  const goTo = (i: number) => {
    if (isTransitioning) return
    transitionTo(infinite ? i + 1 : i, true)
  }

  const previous = () => {
    if (isTransitioning) return
    transitionTo(slideIndex - 1, true)
    if (infinite && slideIndex === 0) {
      slider.addEventListener('transitionend', wrapAround)
    }
  }

  const next = () => {
    if (isTransitioning) return
    transitionTo(slideIndex + 1, true)
    if (infinite && slideIndex === slideCount - 1) {
      slider.addEventListener('transitionend', wrapAround)
    }
  }

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
    slider.setAttribute(jumpAttribute, '')
    touchStartX = touchMoveX = e.targetTouches[0].clientX
    touchMove()

    module.trigger('touchstart')
  })
  slider.addEventListener('touchmove', e => {
    touchMoveX = e.targetTouches[0].clientX
  })
  slider.addEventListener('touchend', () => {
    if (touchStartX && touchMoveX) {
      const threshold = element.getBoundingClientRect().width * 0.35

      slider.removeAttribute(jumpAttribute)
      if (touchMoveX - touchStartX > threshold) {
        previous()
      } else if (touchStartX - touchMoveX > threshold) {
        next()
      } else {
        goTo(infinite ? slideIndex - 1 : slideIndex)
      }
    }

    touchStartX = touchMoveX = undefined

    module.trigger('touchend')
  })

  transitionTo(infinite ? 1 : 0)

  return Object.assign(module, {
    slideIndex,
    goTo,
    previous,
    next
  })
}
