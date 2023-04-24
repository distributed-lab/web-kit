import isPlainObject from 'lodash/isPlainObject'

export const isUndefined = (arg: unknown): arg is undefined => {
  return typeof arg === 'undefined'
}

export const isObject = (arg: unknown): boolean => {
  return isPlainObject(arg)
}

export const isObjectOrArray = (arg: unknown): boolean => {
  return isObject(arg) || Array.isArray(arg)
}
