// Library
import modal from '../../../../src/modal'
import '../../../../src/modal/style.css'

// Example
import { $ } from '../../../../src/lib/dom'
import './example.css'

const modalHandler = modal()

$('#example-modal__trigger-one').addEventListener('click', e => {
  e.preventDefault()
  modalHandler.open('example-modal__one')
})

$('#example-modal__trigger-two').addEventListener('click', e => {
  e.preventDefault()
  modalHandler.open('example-modal__two')
})

$('.example-modal__close').addEventListener('click', e => {
  e.preventDefault()
  modalHandler.close()
})

modalHandler.on('open', () => console.log('Opened'))
modalHandler.on('close', () => console.log('Closed'))
modalHandler.on('load', () => console.log('Load!'))
