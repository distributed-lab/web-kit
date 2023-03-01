/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
export const isObjectOrArray = (arg: unknown): boolean => {
  return arg instanceof Object
}

export const isUndefined = (arg: unknown): arg is undefined => {
  return typeof arg === 'undefined'
}

export const isObject = (arg: unknown): boolean => {
  return !Array.isArray(arg) && arg instanceof Object
}
