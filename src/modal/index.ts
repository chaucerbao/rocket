import { observable, Observable } from 'riot'
import { $$, createElement, wrapElement } from '../lib/dom'

const modalAttribute = 'data-modal'
const dialogAttribute = 'data-modal-dialog'
const openAttribute = 'data-modal-open'
const freezeAttribute = 'data-modal-freeze'

export default (element: HTMLElement) => {
  const module: Observable = observable()
  const documentBody = document.body

  const modal = createElement('div', [], { [modalAttribute]: '' })
  wrapElement(modal, element)

  element.setAttribute(dialogAttribute, '')
  element.addEventListener('load', () => module.trigger('load', element))

  const open = () => {
    if ($$(`[${openAttribute}]`).length === 0)
      documentBody.setAttribute(freezeAttribute, '')

    modal.setAttribute(openAttribute, '')

    module.trigger('open', element)
  }

  const close = () => {
    modal.removeAttribute(openAttribute)

    if ($$(`[${openAttribute}]`).length === 0)
      documentBody.removeAttribute(freezeAttribute)

    module.trigger('close', element)
  }

  return Object.assign(module, {
    open,
    close
  })
}
