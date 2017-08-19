export interface Attributes {
  [key: string]: string
}

export const $ = (target: string, context?: Element) =>
  (context || document).querySelector(target)

export const $$ = (target: string, context?: Element) =>
  (context || document).querySelectorAll(target)

export const parent = (
  element: Element,
  target: string
): Element | undefined => {
  const { parentElement } = element

  if (parentElement && parentElement !== document.body) {
    return parentElement.matches(target)
      ? parentElement
      : parent(parentElement, target)
  }

  return undefined
}

export const createElement = (
  tag: HTMLElement | string,
  classNames: string[] = [],
  attributes: Attributes = {}
) => {
  const element = tag instanceof HTMLElement ? tag : document.createElement(tag)

  classNames.forEach(className => {
    element.classList.add(className)
  })

  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key])
  })

  return element
}

export const wrapElement = (wrapper: HTMLElement, element: HTMLElement) => {
  element.insertAdjacentElement('beforebegin', wrapper)
  wrapper.appendChild(element)

  return wrapper
}
