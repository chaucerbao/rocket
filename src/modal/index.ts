import { observable, Observable } from 'riot'
import { $$ } from '../lib/dom'
import { each } from '../lib/utils'
import { createElement, wrapElement } from '../lib/dom'

export interface Options {
  context?: HTMLElement
}

interface Modals {
  [id: string]: {
    layer: HTMLElement
    element: HTMLElement
  }
}

const modalAttribute = 'data-modal'
const layerAttribute = 'data-modal-layer'
const openAttribute = 'data-modal-open'
const freezeAttribute = 'data-modal-freeze'

export default (options: Options = { context: undefined }) => {
  const { context } = options
  const elements = $$(`[${modalAttribute}]`, context)
  const module: Observable = observable({ elements })
  const modals: Modals = {}
  const stack: string[] = []

  each(elements, (element: HTMLElement) => {
    element.addEventListener('load', () => module.trigger('load', element))

    const layer = createElement('div', [], { [layerAttribute]: '' })
    wrapElement(layer, element)

    const id = element.getAttribute(modalAttribute)

    if (!id || modals[id]) {
      throw new Error('Modal identifier must be uniquely defined')
    }

    modals[id] = {
      layer,
      element
    }
  })

  const keyboardShortcuts = (e: KeyboardEvent) => {
    if (e.keyCode === 27) close()
  }

  const open = (id: string) => {
    const { layer, element } = modals[id]

    if (stack.length === 0) {
      document.body.setAttribute(freezeAttribute, '')
      document.addEventListener('keydown', keyboardShortcuts)
    }

    layer.setAttribute(openAttribute, '')
    stack.push(id)

    module.trigger('open', element)
  }

  const close = () => {
    const id = stack.pop()
    if (!id) return

    const { layer, element } = modals[id]

    layer.removeAttribute(openAttribute)

    if (stack.length === 0) {
      document.body.removeAttribute(freezeAttribute)
      document.removeEventListener('keydown', keyboardShortcuts)
    }

    module.trigger('close', element)
  }

  return Object.assign(module, {
    open,
    close
  })
}
