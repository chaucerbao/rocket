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

export interface Cache {
  [key: string]: any
}

export interface MemoizeOptions {
  limit?: number
}

export const memoize = (
  callback: () => any,
  { limit = 0 }: MemoizeOptions = {}
) => {
  const cache: Cache = {}
  const stack: string[] = []

  return (...args: any[]) => {
    const key = JSON.stringify(args)

    if (!cache.hasOwnProperty(key)) {
      cache[key] = callback(...args)
      stack.push(key)

      if (stack.length && stack.length > limit) {
        delete cache[stack.shift()!]
      }
    }

    return cache[key]
  }
}
