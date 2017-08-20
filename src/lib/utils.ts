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

export const resolve = <T>(value: T | (() => T)) => {
  return value instanceof Function ? value() : value
}
