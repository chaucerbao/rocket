import { $ } from './dom'

export const each = <T>(
  items: T[] | NodeListOf<Element>,
  callback: (item: T, i: number) => any,
  scope?: any
) => {
  const results = []

  for (let i = 0, limit = items.length; i < limit; i++) {
    results.push(callback.call(scope, items[i], i))
  }

  return results
}

export type Resolvable<T> = T | (() => T)

export const resolve = <T>(value: Resolvable<T>) =>
  value instanceof Function ? value() : value

export type ResolvableElement = Resolvable<HTMLElement | string>

export const resolveElement = (value: ResolvableElement) => {
  const resolvedValue = resolve(value)
  const element =
    resolvedValue instanceof HTMLElement
      ? resolvedValue
      : $(resolvedValue) as HTMLElement

  if (!element) {
    throw new Error('Unable to resolve the value to an element')
  }

  return element
}

export interface Cache {
  [key: string]: any
}

export const memoize = (callback: () => any) => {
  const cache: Cache = {}

  return (...args: any[]) => {
    const key = JSON.stringify(args)

    if (!cache.hasOwnProperty(key)) {
      cache[key] = callback(...args)
    }

    return cache[key]
  }
}
