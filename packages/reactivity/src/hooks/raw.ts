import type { Raw } from '@/types'

import { unref } from './ref'

export const toRaw = <T extends object>(target: T): Raw<T> => {
  const obj = {} as Raw<T>

  const descriptors = Object.entries(target).reduce<
    PropertyDescriptorMap & ThisType<T>
  >((acc, [k, v]) => {
    let result: PropertyDescriptor = {
      get: () => unref(v),
      enumerable: true,
    }

    if (typeof v === 'function') {
      result = {
        value: v,
        enumerable: true,
        configurable: true,
        writable: true,
      }
    }

    acc[k] = result
    return acc
  }, {})

  Object.defineProperties(obj, descriptors)

  return obj
}
