const isObjectLike = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null
}

const getTag = (value: unknown): string => {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

export const isPlainObject = (value: unknown): boolean => {
  if (!isObjectLike(value) || getTag(value) != '[object Object]') return false
  if (Object.getPrototypeOf(value) === null) return true

  let proto = value

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}
