import { observable, Observable } from 'riot'
import { createElement, wrapElement } from '../lib/dom'

const modalAttribute = 'data-modal'
const dialogAttribute = 'data-modal-dialog'
const openAttribute = 'data-modal-open'

export default (element: HTMLElement) => {
  const module: Observable = observable()

  const modal = createElement('div', [], { [modalAttribute]: '' })
  wrapElement(modal, element)

  element.setAttribute(dialogAttribute, '')
  element.addEventListener('load', () => module.trigger('load', element))

  const open = () => {
    modal.setAttribute(openAttribute, '')
    module.trigger('open', element)
  }

  const close = () => {
    modal.removeAttribute(openAttribute)
    module.trigger('close', element)
  }

  return Object.assign(module, {
    open,
    close
  })
}
