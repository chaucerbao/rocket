// Library
import smoothScroll from '../../../../src/smooth-scroll'

// Example
import { $, $$ } from '../../../../src/lib/dom'
import { each } from '../../../../src/lib/utils'
import './example.css'

const scrollButtons = $$('.scroll-example__button')

each(scrollButtons, button => {
  button.addEventListener('click', () => {
    const scrollHandler = smoothScroll({
      to:
        window.pageYOffset +
        $('.scroll-example__target').getBoundingClientRect().top
    })

    scrollHandler.on('end', () => console.log('End'))
  })
})
