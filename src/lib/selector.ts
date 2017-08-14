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
