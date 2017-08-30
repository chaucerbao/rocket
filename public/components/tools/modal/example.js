// Library
import modal from '../../../../src/modal'
import '../../../../src/modal/style.css'

// Example
import { $ } from '../../../../src/lib/dom'
import './example.css'

const modalOneHandler = modal($('#modal-1'))
modalOneHandler.on('open', () => console.log('Opened'))
modalOneHandler.on('close', () => console.log('Closed'))

$('#modal-1__trigger').addEventListener('click', e => {
  e.preventDefault()
  modalOneHandler.open()
})

$('#modal-1__close').addEventListener('click', e => {
  e.preventDefault()
  modalOneHandler.close()
})

const modalTwoHandler = modal($('#modal-2'))
modalTwoHandler.on('open', () => console.log('Opened'))
modalTwoHandler.on('close', () => console.log('Closed'))

$('#modal-2__trigger').addEventListener('click', e => {
  e.preventDefault()
  modalTwoHandler.open()
})

$('#modal-2__close').addEventListener('click', e => {
  e.preventDefault()
  modalTwoHandler.close()
})
