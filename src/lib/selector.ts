export const $ = (target: string, context?: Element) =>
  (context || document).querySelector(target)

export const $$ = (target: string, context?: Element) =>
  (context || document).querySelectorAll(target)
